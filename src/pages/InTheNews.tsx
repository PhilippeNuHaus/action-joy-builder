import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface NewsArticle {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  imageUrl?: string;
}

const articles: NewsArticle[] = [
  {
    title: "California blew a hole in environmental planning law. Now, lawmakers are trying to fix it",
    source: "CalMatters",
    date: "March 27, 2026",
    summary:
      "State Sen. Catherine Blakespear introduced a bill seeking to more narrowly define what kinds of facilities are exempt from environmental review — after last year's rushed CEQA reforms created a loophole so broad that even a toxic battery recycling plant might qualify for a pass.",
    url: "https://calmatters.org/environment/2026/03/ceqa-advanced-manufacturing-exemption/",
  },
];

const InTheNews = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            In The News
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Coverage of the fight to protect California's environmental review process.
          </p>
        </div>
      </section>

      <div className="caution-stripe h-3" />

      {/* Articles */}
      <section className="container py-12 md:py-20">
        <div className="grid gap-8 max-w-3xl mx-auto">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="transition-shadow hover:shadow-lg border-border">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="font-semibold text-primary">{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-primary font-heading text-sm uppercase tracking-wider">
                    Read Article <ExternalLink size={14} />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default InTheNews;
