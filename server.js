const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Content templates for different platforms
const templates = {
  linkedin: {
    maxLength: 3000,
    style: 'professional',
    structure: ['hook', 'body', 'cta', 'hashtags']
  },
  twitter: {
    maxLength: 280,
    style: 'punchy',
    structure: ['hook', 'value', 'cta']
  },
  instagram: {
    maxLength: 2200,
    style: 'engaging',
    structure: ['hook', 'story', 'cta', 'hashtags']
  },
  blog: {
    maxLength: 5000,
    style: 'informative',
    structure: ['title', 'intro', 'body', 'conclusion', 'cta']
  },
  email: {
    maxLength: 2000,
    style: 'conversational',
    structure: ['subject', 'greeting', 'body', 'cta', 'signature']
  }
};

// Mock AI content generation
function generateContent(topic, platform, tone = 'professional') {
  const template = templates[platform];
  
  const contents = {
    linkedin: {
      professional: `🚀 ${topic}: A Game-Changer in Modern Business

In today's fast-paced digital landscape, ${topic} has emerged as a critical factor for success. Here's why it matters:

✅ Drives Innovation: ${topic} enables teams to think differently and solve complex problems
✅ Increases Efficiency: Streamlined processes lead to better outcomes
✅ Enhances Collaboration: Breaking down silos for better teamwork

Key Takeaway: Organizations that embrace ${topic} are 3x more likely to outperform their competitors.

What's your experience with ${topic}? Share your thoughts below! 👇

#${topic.replace(/\s+/g, '')} #Innovation #BusinessGrowth #Leadership #DigitalTransformation`,
      
      casual: `Hey LinkedIn fam! 👋

Let's talk about ${topic} - it's been on my mind lately.

I've noticed that companies crushing it right now all have one thing in common: they've figured out ${topic}.

Here's what I've learned:
• It's not as complicated as people think
• Small changes make BIG impacts
• Consistency beats perfection

Anyone else seeing this trend? Drop your thoughts! 💭

#${topic.replace(/\s+/g, '')} #Growth #Learning`,
      
      technical: `Deep Dive: ${topic} Architecture & Implementation

Technical Overview:
${topic} represents a paradigm shift in how we approach system design. Key components include:

1. Core Infrastructure
   - Scalable architecture
   - Fault-tolerant design
   - Real-time processing

2. Integration Patterns
   - API-first approach
   - Microservices compatibility
   - Event-driven architecture

3. Performance Metrics
   - 99.9% uptime
   - <100ms latency
   - Horizontal scalability

Implementation considerations and best practices in comments 👇

#${topic.replace(/\s+/g, '')} #TechArchitecture #Engineering #SystemDesign`
    },
    
    twitter: {
      professional: `${topic} is reshaping how we work.

3 key insights:
• Innovation accelerates
• Efficiency improves
• Teams collaborate better

The future is here. Are you ready?

#${topic.replace(/\s+/g, '')} #Innovation`,
      
      casual: `Just realized: ${topic} is everywhere now 🤯

And honestly? It's making life so much easier.

If you're not using it yet, you're missing out.

#${topic.replace(/\s+/g, '')}`,
      
      technical: `${topic} architecture breakdown:

→ Scalable design
→ Real-time processing
→ API-first approach
→ 99.9% uptime

Thread below 🧵👇

#${topic.replace(/\s+/g, '')} #Tech`
    },
    
    instagram: {
      professional: `✨ ${topic}: Your Secret Weapon for Success ✨

Swipe to learn how ${topic} is transforming businesses worldwide! 👉

In today's competitive landscape, staying ahead means embracing innovation. ${topic} isn't just a trend—it's a necessity.

Here's what you need to know:
🎯 Drives real results
💡 Simplifies complex processes
🚀 Accelerates growth

Ready to level up? Link in bio for our complete guide!

---
#${topic.replace(/\s+/g, '')} #BusinessGrowth #Innovation #Success #Entrepreneur #DigitalMarketing #GrowthMindset #BusinessTips #Motivation #Leadership`,
      
      casual: `okay but can we talk about ${topic}? 🔥

it's literally changing EVERYTHING and i'm here for it 💯

if you haven't tried it yet, what are you waiting for?? seriously, game changer alert 🚨

drop a 💜 if you agree!

---
#${topic.replace(/\s+/g, '')} #LifeHacks #MustTry #GameChanger #Trending #Viral #InstaGood #DailyInspo`,
      
      technical: `⚙️ ${topic}: Technical Deep Dive

Slide 1: Architecture Overview
Slide 2: Key Components
Slide 3: Performance Metrics
Slide 4: Implementation Guide

Swipe for the full breakdown! 👉

Building scalable systems requires understanding ${topic} at a fundamental level. Here's everything you need to know.

Save this for later! 🔖

---
#${topic.replace(/\s+/g, '')} #TechTips #Programming #SoftwareEngineering #Developer #Coding #TechCommunity #LearnToCode #DevLife`
    },
    
    blog: {
      professional: `# The Complete Guide to ${topic}: Everything You Need to Know

## Introduction

In the rapidly evolving digital landscape, ${topic} has emerged as a cornerstone of modern business strategy. This comprehensive guide explores why ${topic} matters and how you can leverage it for success.

## What is ${topic}?

${topic} represents a fundamental shift in how organizations approach innovation and growth. At its core, it combines cutting-edge technology with strategic thinking to deliver measurable results.

## Why ${topic} Matters

### 1. Competitive Advantage
Organizations that embrace ${topic} gain a significant edge over competitors. Studies show a 3x improvement in key performance metrics.

### 2. Operational Efficiency
By streamlining processes and eliminating bottlenecks, ${topic} enables teams to focus on high-value activities.

### 3. Innovation Catalyst
${topic} creates an environment where innovation thrives, leading to breakthrough solutions and new opportunities.

## Key Benefits

- **Increased Productivity**: Teams accomplish more in less time
- **Better Decision Making**: Data-driven insights lead to smarter choices
- **Enhanced Collaboration**: Breaking down silos for seamless teamwork
- **Scalable Growth**: Infrastructure that grows with your business

## Implementation Strategy

### Phase 1: Assessment
Evaluate your current state and identify opportunities for improvement.

### Phase 2: Planning
Develop a roadmap with clear milestones and success metrics.

### Phase 3: Execution
Roll out changes systematically with proper training and support.

### Phase 4: Optimization
Continuously monitor and refine based on results.

## Best Practices

1. Start small and scale gradually
2. Invest in training and education
3. Measure everything
4. Iterate based on feedback
5. Celebrate wins along the way

## Common Pitfalls to Avoid

- Rushing implementation without proper planning
- Neglecting change management
- Ignoring user feedback
- Underestimating resource requirements

## Conclusion

${topic} isn't just a buzzword—it's a proven approach to driving business success. By following the strategies outlined in this guide, you'll be well-positioned to harness its full potential.

Ready to get started? Download our free implementation checklist below!

---

**About the Author**: Expert in digital transformation and business innovation with 10+ years of experience helping organizations succeed.`,
      
      casual: `# Let's Talk About ${topic} (And Why You Should Care)

Hey there! 👋

So, ${topic}. You've probably heard about it everywhere lately, right? And maybe you're wondering if it's actually worth the hype or just another trend that'll fade away.

Spoiler alert: It's the real deal. Let me explain why.

## My ${topic} Journey

I'll be honest—I was skeptical at first. Another "game-changing" thing that everyone's talking about? Yeah, sure. 🙄

But then I actually tried it. And wow, was I wrong.

## What Changed?

Everything. Seriously.

Here's what I noticed:
- Things that used to take hours now take minutes
- My team is actually excited about work (wild, I know)
- We're shipping faster than ever
- And the best part? It's actually sustainable

## The "Aha!" Moment

You know that feeling when something just clicks? That happened to me about two weeks in.

I realized ${topic} isn't about doing MORE—it's about doing things BETTER.

Mind. Blown. 🤯

## How You Can Start

Don't overthink it. Here's what worked for me:

**Week 1**: Just observe and learn
**Week 2**: Try one small thing
**Week 3**: Build on what works
**Week 4**: Share with your team

That's it. No fancy strategy. No complicated roadmap. Just start.

## Real Talk

Is it perfect? Nope.
Will you mess up? Probably.
Is it worth it? Absolutely.

## What's Next?

I'm still learning, still experimenting, still making mistakes. And that's okay.

The point isn't to be perfect—it's to be better than yesterday.

## Your Turn

Have you tried ${topic}? What's been your experience? Drop a comment below—I'd love to hear your story!

And if you haven't tried it yet, what's holding you back? Let's chat about it.

---

**P.S.** If you found this helpful, share it with someone who needs to hear it. Let's spread the good vibes! ✨`,
      
      technical: `# ${topic}: Technical Architecture and Implementation Guide

## Executive Summary

This technical deep-dive explores ${topic} from an engineering perspective, covering architecture patterns, implementation strategies, and performance optimization techniques.

## System Architecture

### High-Level Overview

\`\`\`
┌─────────────────┐
│   Client Layer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Data Layer    │
└─────────────────┘
\`\`\`

### Core Components

#### 1. API Layer
- RESTful endpoints
- GraphQL support
- WebSocket connections
- Rate limiting & throttling

#### 2. Business Logic
- Microservices architecture
- Event-driven design
- CQRS pattern implementation
- Domain-driven design

#### 3. Data Persistence
- Multi-database strategy
- Caching layer (Redis)
- Message queue (RabbitMQ)
- Search engine (Elasticsearch)

## Technical Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js / Fastify
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Queue**: RabbitMQ 3.11+

### Frontend
- **Framework**: React 18 / Vue 3
- **State Management**: Redux / Pinia
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS

### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## Implementation Details

### Phase 1: Foundation (Week 1-2)

\`\`\`javascript
// Initialize core services
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new PostgreSQL({
  host: process.env.DB_HOST,
  port: 5432,
  database: 'content_forge'
});

// Redis cache
const cache = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379
});
\`\`\`

### Phase 2: Core Features (Week 3-4)

\`\`\`javascript
// Content generation service
class ContentGenerator {
  async generate(topic, platform, options) {
    // Check cache first
    const cached = await cache.get(\`content:\${topic}:\${platform}\`);
    if (cached) return cached;
    
    // Generate new content
    const content = await this.aiGenerate(topic, platform, options);
    
    // Cache result
    await cache.set(\`content:\${topic}:\${platform}\`, content, 'EX', 3600);
    
    return content;
  }
}
\`\`\`

### Phase 3: Optimization (Week 5-6)

Performance targets:
- API response time: <100ms (p95)
- Cache hit rate: >80%
- Uptime: 99.9%
- Concurrent users: 10,000+

## Scalability Considerations

### Horizontal Scaling
- Stateless service design
- Load balancer (Nginx)
- Auto-scaling policies
- Database read replicas

### Vertical Scaling
- Resource optimization
- Connection pooling
- Query optimization
- Index strategy

## Security Implementation

### Authentication & Authorization
\`\`\`javascript
// JWT-based auth
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

### Data Protection
- Encryption at rest (AES-256)
- TLS 1.3 for transport
- Input validation & sanitization
- SQL injection prevention
- XSS protection

## Monitoring & Observability

### Metrics Collection
\`\`\`javascript
// Prometheus metrics
const promClient = require('prom-client');
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});
\`\`\`

### Logging Strategy
- Structured logging (JSON)
- Log levels (ERROR, WARN, INFO, DEBUG)
- Centralized log aggregation
- Real-time alerting

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| API Latency (p50) | <50ms | 42ms |
| API Latency (p95) | <100ms | 87ms |
| API Latency (p99) | <200ms | 156ms |
| Throughput | 1000 req/s | 1250 req/s |
| Error Rate | <0.1% | 0.05% |
| Cache Hit Rate | >80% | 85% |

## Deployment Strategy

### Blue-Green Deployment
1. Deploy new version (green)
2. Run smoke tests
3. Gradually shift traffic
4. Monitor metrics
5. Rollback if needed

### Rollback Procedure
\`\`\`bash
# Quick rollback
kubectl rollout undo deployment/content-forge

# Rollback to specific revision
kubectl rollout undo deployment/content-forge --to-revision=2
\`\`\`

## Future Enhancements

### Q3 2026
- [ ] GraphQL API
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Mobile SDK

### Q4 2026
- [ ] Multi-region deployment
- [ ] Edge computing integration
- [ ] ML model optimization
- [ ] Advanced caching strategies

## Conclusion

${topic} implementation requires careful planning and execution. This guide provides a solid foundation for building scalable, performant systems.

For questions or contributions, open an issue on GitHub.

---

**Technical Lead**: Senior Software Engineer with expertise in distributed systems and cloud architecture.`
    },
    
    email: {
      professional: `Subject: Unlock the Power of ${topic} for Your Business

Hi there,

I hope this email finds you well!

I wanted to reach out because I've been seeing incredible results with ${topic}, and I thought you might find it valuable too.

Here's what caught my attention:

✓ 3x improvement in efficiency
✓ Significant cost savings
✓ Better team collaboration
✓ Measurable ROI within 90 days

Many organizations are already leveraging ${topic} to stay competitive. The question is: are you ready to join them?

I'd love to share more details about how ${topic} can benefit your specific situation. Would you be open to a quick 15-minute call this week?

You can book a time directly here: [Calendar Link]

Looking forward to connecting!

Best regards,
[Your Name]
[Your Title]
[Company Name]

P.S. I've attached a case study showing real results from companies like yours. Check it out!`,
      
      casual: `Subject: You NEED to see this 👀

Hey!

Quick question: have you heard about ${topic}?

If not, you're in for a treat. If yes, then you know what I'm about to say 😄

I've been using it for the past few weeks and honestly? Game changer.

Here's the deal:
• It saves me like 5 hours a week (no joke)
• My team actually enjoys using it
• Results are way better than before

I know, I know... another "must-have" tool, right? But trust me on this one.

Want to see it in action? Hit reply and I'll send you a quick demo video.

Or if you're ready to dive in, here's the link: [Link]

Either way, let me know what you think!

Cheers,
[Your Name]

P.S. Seriously, just try it. You can thank me later 😉`,
      
      technical: `Subject: ${topic} Implementation Guide - Technical Overview

Hello,

Following up on our discussion about ${topic} integration, I've prepared a technical overview for your engineering team.

**Architecture Highlights:**

1. Microservices-based design
   - Scalable and fault-tolerant
   - API-first approach
   - Event-driven architecture

2. Technology Stack
   - Backend: Node.js / Python
   - Database: PostgreSQL + Redis
   - Infrastructure: Docker + Kubernetes

3. Integration Points
   - RESTful API
   - WebSocket support
   - Webhook notifications
   - SDK available (JS, Python, Go)

**Performance Metrics:**
- 99.9% uptime SLA
- <100ms API response time
- Horizontal scalability
- Auto-scaling support

**Security Features:**
- End-to-end encryption
- OAuth 2.0 / JWT authentication
- Role-based access control
- SOC 2 Type II compliant

**Implementation Timeline:**
- Week 1-2: Setup & configuration
- Week 3-4: Integration & testing
- Week 5-6: Deployment & monitoring

I've attached detailed technical documentation and API specs. Let me know if you need any clarification or would like to schedule a technical deep-dive session.

Best regards,
[Your Name]
[Your Title]
[Company Name]

---
Technical Documentation: [Link]
API Reference: [Link]
GitHub Repository: [Link]`
    }
  };
  
  return contents[platform][tone] || contents[platform].professional;
}

// API: Generate content for all platforms
app.post('/api/generate', (req, res) => {
  const { topic, tone = 'professional' } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  
  const results = {};
  
  Object.keys(templates).forEach(platform => {
    results[platform] = {
      content: generateContent(topic, platform, tone),
      metadata: {
        platform,
        tone,
        length: generateContent(topic, platform, tone).length,
        maxLength: templates[platform].maxLength,
        style: templates[platform].style
      }
    };
  });
  
  res.json({
    success: true,
    topic,
    tone,
    results,
    timestamp: new Date().toISOString()
  });
});

// API: Generate for specific platform
app.post('/api/generate/:platform', (req, res) => {
  const { platform } = req.params;
  const { topic, tone = 'professional' } = req.body;
  
  if (!templates[platform]) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  
  const content = generateContent(topic, platform, tone);
  
  res.json({
    success: true,
    platform,
    topic,
    tone,
    content,
    metadata: {
      length: content.length,
      maxLength: templates[platform].maxLength,
      style: templates[platform].style
    }
  });
});

// API: Get supported platforms
app.get('/api/platforms', (req, res) => {
  res.json({
    platforms: Object.keys(templates).map(key => ({
      name: key,
      ...templates[key]
    }))
  });
});

app.listen(PORT, () => {
  console.log(`Content Forge running on port ${PORT}`);
});
