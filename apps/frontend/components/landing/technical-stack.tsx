import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Database,
  Layers,
  Monitor,
  Server,
  Smartphone,
  Cpu,
} from "lucide-react";

const techStack = [
  {
    category: "Frontend & Mobile",
    icon: Smartphone,
    technologies: ["React", "Next.js", "PWA", "TypeScript"],
    color: "from-blue-500 to-cyan-500",
    description: "Modern web and mobile applications",
  },
  {
    category: "Backend & APIs",
    icon: Server,
    technologies: ["JWT", "WebSocket", "REST APIs"],
    color: "from-emerald-500 to-green-500",
    description: "Scalable server infrastructure",
  },
  {
    category: "Artificial Intelliegence",
    icon: Cpu,
    technologies: ["Anthropic", "MCP", "LangChain"],
    color: "from-purple-500 to-pink-500",
    description: "Intelligent energy optimization",
  },
  {
    category: "Data & Analytics",
    icon: Database,
    technologies: ["PostgreSQL", "MongoDB", "Redis", "ChromaDB"],
    color: "from-orange-500 to-red-500",
    description: "Real-time data processing",
  },
  {
    category: "Infrastructure",
    icon: Cloud,
    technologies: ["Kubernetes", "Docker", "Helm", "ArgoCD"],
    color: "from-teal-500 to-blue-500",
    description: "Global cloud deployment",
  },
  {
    category: "Monitoring & DevOps",
    icon: Monitor,
    technologies: ["Grafana", "CI/CD"],
    color: "from-indigo-500 to-purple-500",
    description: "Observability and automation",
  },
];

export function TechnicalStack() {
  return (
    <section id="tech-stack" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300">
            Technology Stack
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built on
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              cutting-edge technology
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform leverages the latest technologies to deliver unmatched
            performance, scalability, and reliability.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {techStack.map((stack, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <CardContent className="p-8">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stack.color} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <stack.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-all duration-300">
                  {stack.category}
                </h3>
                <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-all duration-300">
                  {stack.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="bg-white/10 text-gray-300 border-white/20 text-xs hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30 transition-all duration-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Architecture Diagram */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg hover:scale-110 transition-all duration-300">
                <Layers className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Microservices Architecture
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Our distributed architecture ensures 99.99% uptime, horizontal
              scalability, and seamless global deployment across multiple
              regions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
                Scalable
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300">
                Reliable
              </Badge>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300">
                Secure
              </Badge>
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
                Fast
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
