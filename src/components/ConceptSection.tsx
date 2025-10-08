const ConceptSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-16 leading-tight">
              What Actually Happens at This Summit
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll build something.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  An actual prototype or tool you can use Monday morning. Real challenges, not hypotheticals.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll make friends.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The format forces collaboration. By end of day, inside jokes turn into ongoing partnerships and actual friendships.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll find your position in the AI landscape.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  See where you naturally fit and leave with a clear roadmap for what to develop next.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll know how to actually use AI tools.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Use them, watch others apply them. That same evening, techniques that cut your work time in half.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll see new possibilities.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Watch different approaches to the same problem. That stuck project suddenly has five new angles.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll build real momentum.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Confidence from doing, not listening. A network actively working on what's next. Career moves six months from now trace back to here.
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">You'll feel less alone.</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Everyone's figuring this out. Even the experts are improvising. Relief happens in the first few hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
