const ConceptSection = () => {
  const outcomes = [
    {
      title: "You'll build something.",
      description: "An actual prototype or tool you can use Monday morning. Real challenges, not hypotheticals.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You'll make friends.",
      description: "The format forces collaboration. By end of day, inside jokes turn into ongoing partnerships and actual friendships.",
      gradient: "from-secondary/20 to-transparent"
    },
    {
      title: "You'll find your position in the AI landscape.",
      description: "See where you naturally fit and leave with a clear roadmap for what to develop next.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You'll know how to actually use AI tools.",
      description: "Use them, watch others apply them. That same evening, techniques that cut your work time in half.",
      gradient: "from-secondary/20 to-transparent"
    },
    {
      title: "You'll see new possibilities.",
      description: "Watch different approaches to the same problem. That stuck project suddenly has five new angles.",
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "You'll build real momentum.",
      description: "Confidence from doing, not listening. A network actively working on what's next. Career moves six months from now trace back to here.",
      gradient: "from-secondary/20 to-transparent"
    },
    {
      title: "You'll feel less alone.",
      description: "Everyone's figuring this out. Even the experts are improvising. Relief happens in the first few hours.",
      gradient: "from-primary/20 to-transparent"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-20 leading-tight text-center">
            What Actually Happens <br />
            <span className="text-gradient">at This Summit</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover-scale"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${outcome.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-6xl font-bold text-primary/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    {outcome.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
