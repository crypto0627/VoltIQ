import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, LineChart, Shield, Zap, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Infrastructure",
    description:
      "Deploy energy solutions across 50+ countries with our distributed network",
    badge: "Enterprise",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Cpu,
    title: "AI-Powered Optimization",
    description:
      "Machine learning algorithms that optimize energy distribution in real-time",
    badge: "AI",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description:
      "Go from concept to production in minutes with our automated infrastructure",
    badge: "Fast",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security with end-to-end encryption and compliance certifications",
    badge: "Secure",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: LineChart,
    title: "Real-time Analytics",
    description:
      "Monitor performance, predict maintenance, and optimize efficiency with live data",
    badge: "Analytics",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: Smartphone,
    title: "Developer-First API",
    description:
      "RESTful APIs and SDKs that integrate seamlessly with your existing systems",
    badge: "API",
    color: "from-indigo-500 to-purple-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
            Built for developers
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything you need to build
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              the future of energy
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform provides all the tools and infrastructure you need to
            create, deploy, and scale renewable energy solutions globally.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-gray-300 border-white/20 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300"
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-all duration-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
              Start Building
            </button>
            <button className="px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
