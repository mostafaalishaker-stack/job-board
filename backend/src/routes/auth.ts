import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'employer' | 'candidate';
}

const users: User[] = [];
let nextId = 1;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      res.status(400).json({ error: 'All fields required' });
      return;
    }
    if (role !== 'employer' && role !== 'candidate') {
      res.status(400).json({ error: 'Role must be employer or candidate' });
      return;
    }
    if (users.find(u => u.email === email)) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user: User = { id: nextId++, email, password: hashed, name, role };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const authMiddleware = (req: Request, res: Response, next: Function): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const employerMiddleware = (req: Request, res: Response, next: Function): void => {
  const user = (req as any).user;
  if (!user || user.role !== 'employer') {
    res.status(403).json({ error: 'Employers only' });
    return;
  }
  next();
};

export const candidateMiddleware = (req: Request, res: Response, next: Function): void => {
  const user = (req as any).user;
  if (!user || user.role !== 'candidate') {
    res.status(403).json({ error: 'Candidates only' });
    return;
  }
  next();
};

export default router;
