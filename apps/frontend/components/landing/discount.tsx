import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingDown, TrendingUp, DollarSign, Zap } from "lucide-react";

const metrics = [
  {
    icon: TrendingDown,
    title: "Carbon Reduction",
    value: "85%",
    description: "Average CO₂ emissions reduction",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: DollarSign,
    title: "Cost Savings",
    value: "$2.4M",
    description: "Average annual savings per client",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Efficiency Gain",
    value: "67%",
    description: "Energy efficiency improvement",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Uptime",
    value: "99.99%",
    description: "System reliability guarantee",
    color: "from-orange-500 to-red-500",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 10 energy nodes",
      "Basic monitoring dashboard",
      "Email support",
      "Standard API access",
      "Monthly reports",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "Ideal for growing companies",
    features: [
      "Up to 100 energy nodes",
      "Advanced AI analytics",
      "24/7 priority support",
      "Full API access",
      "Real-time monitoring",
      "Custom integrations",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    features: [
      "Unlimited energy nodes",
      "White-label solutions",
      "Dedicated account manager",
      "Custom development",
      "SLA guarantees",
      "On-premise deployment",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

export function Discount() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Metrics Section */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
            Proven Results
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real impact,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              measurable results
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Our clients achieve significant environmental and financial benefits
            through our innovative energy solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${metric.color} mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-all duration-300">
                    {metric.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-300 mb-1 group-hover:text-gray-200 transition-all duration-300">
                    {metric.title}
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-all duration-300">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-16" id="subscribe">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? "ring-2 ring-emerald-500/50 scale-105 hover:ring-emerald-400/70 hover:shadow-emerald-500/20"
                  : "hover:border-emerald-500/30 hover:shadow-emerald-500/10"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg">
                  Most Popular
                </Badge>
              )}
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-all duration-300">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white group-hover:text-emerald-400 transition-all duration-300">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-all duration-300">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-300 group-hover:text-gray-200 transition-all duration-300"
                    >
                      <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                      : "bg-white/10 hover:bg-emerald-500/20 text-white border-white/20 hover:border-emerald-500/30 hover:text-emerald-400"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Need a custom solution?</p>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 hover:scale-105"
          >
            Contact our sales team
          </Button>
        </div>
      </div>
    </section>
  );
}
