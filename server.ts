import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { INITIAL_USERS, INITIAL_ROUNDS, INITIAL_BETS, INITIAL_NOTIFICATIONS } from "./src/data/initialData";
import { BRASILEIRAO_TEAMS } from "./src/data/teams";

interface BolaoDb {
  users: any[];
  teams: any[];
  rounds: any[];
  bets: any[];
  notifications: any[];
  config: {
    autoApprovePix: boolean;
    pixKey: string;
    pixReceiver: string;
  };
  lastModified: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "bolao-db.json");

function ensureDb(): BolaoDb {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.bets)) {
        return {
          users: parsed.users || INITIAL_USERS,
          teams: parsed.teams || BRASILEIRAO_TEAMS,
          rounds: parsed.rounds || INITIAL_ROUNDS,
          bets: parsed.bets || INITIAL_BETS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          config: parsed.config || {
            autoApprovePix: false,
            pixKey: "pix@bolao2026.com.br",
            pixReceiver: "Bolão Brasileirão 2026 Oficial"
          },
          lastModified: parsed.lastModified || Date.now()
        };
      }
    }
  } catch (err) {
    console.error("Error reading database file, initializing fresh database:", err);
  }

  const initialDb: BolaoDb = {
    users: INITIAL_USERS,
    teams: BRASILEIRAO_TEAMS,
    rounds: INITIAL_ROUNDS,
    bets: INITIAL_BETS,
    notifications: INITIAL_NOTIFICATIONS,
    config: {
      autoApprovePix: false,
      pixKey: "pix@bolao2026.com.br",
      pixReceiver: "Bolão Brasileirão 2026 Oficial"
    },
    lastModified: Date.now()
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write initial db file:", err);
  }

  return initialDb;
}

let db = ensureDb();

let isSaving = false;
let pendingSave = false;

async function saveDbAsync() {
  if (isSaving) {
    pendingSave = true;
    return;
  }
  isSaving = true;
  try {
    db.lastModified = Date.now();
    await fs.promises.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed saving db to disk:", err);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      saveDbAsync();
    }
  }
}

function updateRoundsPot() {
  db.rounds = db.rounds.map(r => {
    const confirmedBets = db.bets.filter(b => b.roundId === r.id && b.status === "confirmed");
    const betPrice = r.price || 10.00;
    return {
      ...r,
      totalPot: confirmedBets.length * betPrice
    };
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for large payload (e.g. PIX receipts base64)
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // CORS Headers for any client devices
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: Date.now(),
      usersCount: db.users.length,
      betsCount: db.bets.length,
      roundsCount: db.rounds.length,
      lastModified: db.lastModified
    });
  });

  // Get full state or check if modified
  app.get("/api/state", (req, res) => {
    const since = req.query.since ? Number(req.query.since) : null;
    if (since && since >= db.lastModified) {
      res.json({
        success: true,
        notModified: true,
        lastModified: db.lastModified
      });
      return;
    }

    updateRoundsPot();

    res.json({
      success: true,
      notModified: false,
      users: db.users,
      teams: db.teams,
      rounds: db.rounds,
      bets: db.bets,
      notifications: db.notifications,
      config: db.config,
      lastModified: db.lastModified
    });
  });

  // Two-way synchronization endpoint: merges client state with server state
  app.post("/api/sync", async (req, res) => {
    try {
      const { users, bets, rounds, teams, notifications } = req.body || {};
      let changed = false;

      // 1. Merge Users
      if (Array.isArray(users) && users.length > 0) {
        users.forEach(clientUser => {
          if (!clientUser?.id) return;
          const idx = db.users.findIndex(u => u.id === clientUser.id);
          if (idx === -1) {
            db.users.push(clientUser);
            changed = true;
          } else {
            // Keep existing admin role and merge non-empty fields
            const existing = db.users[idx];
            if (existing.role === 'admin' && clientUser.role !== 'admin') {
              clientUser.role = 'admin';
            }
            db.users[idx] = { ...existing, ...clientUser };
          }
        });
      }

      // 2. Merge Bets (Crucial for mobile users!)
      if (Array.isArray(bets) && bets.length > 0) {
        bets.forEach(clientBet => {
          if (!clientBet?.id) return;
          const idx = db.bets.findIndex(b => b.id === clientBet.id);
          if (idx === -1) {
            // Check auto-approve setting
            if (db.config.autoApprovePix && clientBet.status === 'receipt_submitted') {
              clientBet.status = 'confirmed';
              clientBet.paymentConfirmedAt = new Date().toISOString();
            }
            db.bets.push(clientBet);
            changed = true;
          } else {
            const serverBet = db.bets[idx];
            // Prioritize confirmed status
            if (serverBet.status === 'confirmed' && clientBet.status !== 'confirmed') {
              // keep server status as confirmed
              clientBet.status = 'confirmed';
              clientBet.paymentConfirmedAt = serverBet.paymentConfirmedAt || clientBet.paymentConfirmedAt;
            } else if (clientBet.status === 'confirmed' && serverBet.status !== 'confirmed') {
              changed = true;
            } else if (clientBet.receiptUrl && !serverBet.receiptUrl) {
              changed = true;
            } else if (Object.keys(clientBet.predictions || {}).length > Object.keys(serverBet.predictions || {}).length) {
              changed = true;
            }
            db.bets[idx] = { ...serverBet, ...clientBet };
          }
        });
      }

      // 3. Merge Rounds
      if (Array.isArray(rounds) && rounds.length > 0) {
        rounds.forEach(clientRound => {
          if (!clientRound?.id) return;
          const idx = db.rounds.findIndex(r => r.id === clientRound.id);
          if (idx === -1) {
            db.rounds.push(clientRound);
            changed = true;
          } else {
            const serverRound = db.rounds[idx];
            // If client has finished status or scores updated
            if (clientRound.status === 'finished' && serverRound.status !== 'finished') {
              db.rounds[idx] = clientRound;
              changed = true;
            } else if (JSON.stringify(clientRound.matches) !== JSON.stringify(serverRound.matches)) {
              db.rounds[idx] = { ...serverRound, ...clientRound };
              changed = true;
            }
          }
        });
      }

      // 4. Merge Teams
      if (Array.isArray(teams) && teams.length > 0) {
        teams.forEach(clientTeam => {
          if (!clientTeam?.id) return;
          const idx = db.teams.findIndex(t => t.id === clientTeam.id);
          if (idx === -1) {
            db.teams.push(clientTeam);
            changed = true;
          }
        });
      }

      // 5. Merge Notifications
      if (Array.isArray(notifications) && notifications.length > 0) {
        notifications.forEach(clientNotif => {
          if (!clientNotif?.id) return;
          if (!db.notifications.some(n => n.id === clientNotif.id)) {
            db.notifications.unshift(clientNotif);
            changed = true;
          }
        });
        // Limit notifications size
        if (db.notifications.length > 100) {
          db.notifications = db.notifications.slice(0, 100);
        }
      }

      updateRoundsPot();

      if (changed) {
        await saveDbAsync();
      }

      res.json({
        success: true,
        users: db.users,
        teams: db.teams,
        rounds: db.rounds,
        bets: db.bets,
        notifications: db.notifications,
        config: db.config,
        lastModified: db.lastModified
      });
    } catch (err: any) {
      console.error("Error in /api/sync:", err);
      res.status(500).json({ success: false, message: err?.message || "Sync failed" });
    }
  });

  // Create or Update a Bet (Mobile, PC, etc.)
  app.post("/api/bets", async (req, res) => {
    try {
      const bet = req.body;
      if (!bet || !bet.id || !bet.userId) {
        res.status(400).json({ success: false, message: "Invalid bet data" });
        return;
      }

      if (db.config.autoApprovePix && bet.status === "receipt_submitted") {
        bet.status = "confirmed";
        bet.paymentConfirmedAt = new Date().toISOString();
      }

      const idx = db.bets.findIndex(b => b.id === bet.id);
      if (idx >= 0) {
        db.bets[idx] = { ...db.bets[idx], ...bet };
      } else {
        db.bets.push(bet);
      }

      updateRoundsPot();
      await saveDbAsync();

      res.json({
        success: true,
        bet: idx >= 0 ? db.bets[idx] : bet,
        lastModified: db.lastModified
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || "Error saving bet" });
    }
  });

  // Admin approves a bet
  app.post("/api/bets/approve", async (req, res) => {
    try {
      const { betId, adminNotes } = req.body;
      const idx = db.bets.findIndex(b => b.id === betId);
      if (idx === -1) {
        res.status(404).json({ success: false, message: "Bet not found" });
        return;
      }

      db.bets[idx] = {
        ...db.bets[idx],
        status: "confirmed",
        paymentConfirmedAt: new Date().toISOString(),
        adminNotes: adminNotes || "Aprovado pelo Administrador"
      };

      updateRoundsPot();
      await saveDbAsync();

      res.json({
        success: true,
        bet: db.bets[idx],
        lastModified: db.lastModified
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Admin approves ALL pending bets
  app.post("/api/bets/approve-all", async (req, res) => {
    try {
      const { roundId } = req.body;
      let count = 0;
      db.bets = db.bets.map(b => {
        if (b.status === "receipt_submitted" && (!roundId || b.roundId === roundId)) {
          count++;
          return {
            ...b,
            status: "confirmed",
            paymentConfirmedAt: new Date().toISOString(),
            adminNotes: "Aprovado em lote pelo Administrador"
          };
        }
        return b;
      });

      updateRoundsPot();
      await saveDbAsync();

      res.json({
        success: true,
        count,
        lastModified: db.lastModified
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Admin rejects a bet
  app.post("/api/bets/reject", async (req, res) => {
    try {
      const { betId, reason } = req.body;
      const idx = db.bets.findIndex(b => b.id === betId);
      if (idx === -1) {
        res.status(404).json({ success: false, message: "Bet not found" });
        return;
      }

      db.bets[idx] = {
        ...db.bets[idx],
        status: "rejected",
        adminNotes: reason || "Comprovante inválido"
      };

      updateRoundsPot();
      await saveDbAsync();

      res.json({
        success: true,
        bet: db.bets[idx],
        lastModified: db.lastModified
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Create or update round
  app.post("/api/rounds", async (req, res) => {
    try {
      const round = req.body;
      if (!round || !round.id) {
        res.status(400).json({ success: false, message: "Invalid round" });
        return;
      }

      const idx = db.rounds.findIndex(r => r.id === round.id);
      if (idx >= 0) {
        db.rounds[idx] = { ...db.rounds[idx], ...round };
      } else {
        db.rounds.push(round);
      }

      updateRoundsPot();
      await saveDbAsync();

      res.json({
        success: true,
        round: idx >= 0 ? db.rounds[idx] : round,
        lastModified: db.lastModified
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Update app config (e.g. autoApprovePix)
  app.post("/api/config", async (req, res) => {
    try {
      const config = req.body;
      db.config = { ...db.config, ...config };
      await saveDbAsync();
      res.json({ success: true, config: db.config, lastModified: db.lastModified });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Reset database back to default initial state
  app.post("/api/reset-data", async (req, res) => {
    try {
      db = {
        users: INITIAL_USERS,
        teams: BRASILEIRAO_TEAMS,
        rounds: INITIAL_ROUNDS,
        bets: INITIAL_BETS,
        notifications: INITIAL_NOTIFICATIONS,
        config: {
          autoApprovePix: false,
          pixKey: "pix@bolao2026.com.br",
          pixReceiver: "Bolão Brasileirão 2026 Oficial"
        },
        lastModified: Date.now()
      };
      await saveDbAsync();
      res.json({ success: true, message: "Database reset to defaults", state: db });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bolão Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
