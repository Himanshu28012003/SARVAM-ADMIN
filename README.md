# SarvaEdu - Principal Admin Portal

A comprehensive education management platform for school principals to monitor teacher activities, manage classrooms, and generate insightful reports.

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library with hooks and functional components |
| TypeScript | 5.x | Type safety and better DX |
| Vite | 6.x | Fast build tool and dev server |
| Tailwind CSS | 4.2.0 | Utility-first CSS framework |
| React Router | 7.13.0 | Client-side routing |
| Axios | 1.13.5 | HTTP client for API calls |
| Recharts | 3.7.0 | Data visualization charts |
| Lucide React | 0.575.0 | Modern icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x+ | JavaScript runtime |
| Express | 5.2.1 | Web framework |
| TypeScript | 5.x | Type safety |
| Neon Database | Serverless | PostgreSQL database |
| JWT | 9.0.3 | Authentication tokens |
| bcryptjs | 3.0.3 | Password hashing |
| CORS | 2.8.6 | Cross-origin resource sharing |

## Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Neon Database account (or any PostgreSQL)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sarvaedu.git
cd sarvaedu

# Install backend dependencies
cd principalservice
npm install

# Install frontend dependencies
cd ../Frontent/sarvam
npm install
```

### Environment Setup

Create `.env` file in `principalservice/`:



### Running the Application

```bash
# Terminal 1 - Start Backend
cd principalservice
npm run dev

# Terminal 2 - Start Frontend  
cd Frontent/sarvam
npm run dev
```


### Database Setup

```bash
# Seed the database with sample data
cd principalservice
npm run seed
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/register` | Register new admin |
| POST | `/api/admin/login` | Login and get JWT |
| GET | `/api/admin/profile` | Get current user profile |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | List all activities |
| GET | `/api/stats` | Get overall statistics |
| GET | `/api/summary` | Get teacher summary |
| GET | `/api/teachers` | List all teachers |
| GET | `/api/teachers/:id` | Get teacher details |
| GET | `/api/trends/weekly` | Weekly activity trends |
| GET | `/api/trends/daily` | Daily activity trends |

## Project Structure

```
SarvaEdu/
├── Frontent/sarvam/
│   ├── src/
│   │   ├── components/     # Sidebar, Header, StatCard, etc.
│   │   ├── context/        # AuthContext for auth state
│   │   ├── pages/          # Dashboard, Teachers, Reports, etc.
│   │   ├── services/       # API service with axios
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Main app with routing
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── principalservice/
│   ├── src/
│   │   ├── controllers/    # Business logic handlers
│   │   ├── db/             # Neon database connection
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # TypeScript models
│   │   ├── routes/         # Express route definitions
│   │   └── index.ts        # Server entry point
│   ├── seed.ts             # Database seeder
│   └── package.json
│
├── ARCHITECTURE.md         # System architecture docs
└── README.md               # This file
```

## Redis Integration (Future)

Redis can be integrated for several use cases:

### 1. Session Management
```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Store session
await redis.set(`session:${userId}`, token, 'EX', 86400);

// Revoke session (logout)
await redis.del(`session:${userId}`);
```

### 2. API Response Caching
```typescript
// Cache expensive queries
const cacheKey = 'stats:overall';
let stats = await redis.get(cacheKey);

if (!stats) {
  stats = await getStatsFromDB();
  await redis.set(cacheKey, JSON.stringify(stats), 'EX', 300); // 5 min cache
}
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
```

### 4. Real-time Dashboard Updates
```typescript
// Publisher (on activity creation)
redis.publish('activity:new', JSON.stringify(activity));

// Subscriber (WebSocket server)
redis.subscribe('activity:new', (message) => {
  io.emit('newActivity', JSON.parse(message));
});
```

### Installation
```bash
npm install ioredis rate-limit-redis
```

## Future Scalability

### Phase 1: Optimization
- [ ] Add Redis caching for frequently accessed data
- [ ] Implement database connection pooling
- [ ] Add API response compression (gzip)
- [ ] Implement lazy loading for frontend routes

### Phase 2: Horizontal Scaling
- [ ] Deploy multiple API instances behind load balancer
- [ ] Move to Redis Cluster for cache
- [ ] Add read replicas for database
- [ ] Implement CDN for static assets

### Phase 3: Advanced Features
- [ ] Background job processing with Bull Queue
- [ ] Real-time notifications with WebSockets
- [ ] Microservices architecture for independent scaling
- [ ] GraphQL API for flexible queries

### Scaling Architecture
```
                    ┌─────────────┐
                    │   CDN       │
                    │  (Vercel)   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │Load Balancer│
                    │   (nginx)   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  API Pod 1  │ │  API Pod 2  │ │  API Pod N  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │   Primary   │ │ Redis │ │   Worker    │
       │  PostgreSQL │ │Cluster│ │   Pods      │
       └──────┬──────┘ └───────┘ └─────────────┘
              │
       ┌──────▼──────┐
       │Read Replicas│
       └─────────────┘
```

## Performance Considerations

| Area | Current | With Redis | Improvement |
|------|---------|------------|-------------|
| API Response | ~200ms | ~50ms | 4x faster |
| Auth Check | DB query | Memory lookup | 10x faster |
| Dashboard Load | 5 queries | 1 cached response | 5x faster |
| Concurrent Users | ~100 | ~10,000+ | 100x capacity |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please open a GitHub issue.
