import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X, Star } from "lucide-react";
import { useState } from "react";
import calmattersImg from "@/assets/calmatters-article.png";
import capitolWeeklyImg from "@/assets/capitol-weekly-article.png";

interface NewsArticle {
  title: string;
  source: string;
  date: string;
  author: string;
  summary: string;
  url: string;
  imageUrl: string;
  body: string[];
  featured?: boolean;
}

const articles: NewsArticle[] = [
  {
    title: "Voters oppose advanced manufacturing CEQA exemptions",
    source: "Capitol Weekly",
    date: "April 6, 2026",
    author: "Bonnie Hamilton",
    summary:
      "A new statewide poll finds 64% of voters would hold it against lawmakers who approved exemptions for polluting industries near homes and schools.",
    url: "https://capitolweekly.net/voters-oppose-advanced-manufacturing-ceqa-exemptions/",
    imageUrl: capitolWeeklyImg,
    featured: true,
    body: [
      "As a pediatrician, I see the consequences of industrial pollution affecting children's health every day: the asthma that keeps a child home from school, the developmental delays that follow early lead exposure, the elevated cancer risk that trails a childhood spent near a petrochemical facility. These outcomes are not inevitable; they are the predictable result of policy choices. Last year, the California Legislature voted to exempt dozens of categories of industrial facilities from the environmental review process that exists to prevent exactly those harms, and a striking new poll suggests they badly misjudged how the public would feel about it.",
      "When lawmakers passed Senate Bill 131, exempting more than 75 categories of industrial facilities from California's landmark environmental review law, perhaps they assumed voters either weren't paying attention or didn't care. Voters were additionally concerned about the cost to taxpayers when contamination goes unaddressed, and California has a $750 million lesson in what that looks like. The remediation of the Exide battery recycling plant in L.A. County landed almost entirely on the public.",
      "The bipartisan character of these findings deserves particular attention in Sacramento, where the Abundance Agenda has been sold as a politically safe vehicle for deregulation. CEQA approval runs to 90% among Democrats, 73% among independents, and even a plurality (41%) among Republicans. Opposition to the advanced manufacturing exemption created by SB 131 holds at 58% and up to 67% in every region of the state.",
      "Californians approve of CEQA, nearly two-thirds oppose the exemption, and most significantly for anyone serving in the Legislature, 64% say they would be less likely to support a lawmaker who backed these exemptions. Those numbers hold across party lines, regions, and every age group surveyed.",
      "After SB 131 passed, many lawmakers acknowledged that including the manufacturing exemption had been a mistake and promised to remedy it. However, they did not do so during last year's session. SB 954, now before the Legislature, is their opportunity to keep that promise, restoring the most essential safeguards removed by SB 131 and requiring the environmental review and public disclosure that communities deserve before an industrial facility goes up near their child's school.",
      "Advanced manufacturing is a broad category comprising more than 75 types of industrial operations spanning plastics, petrochemicals, nuclear, defense, and mining. Industrial facilities like these often emit toxic pollutants – arsenic, cyanide, hexavalent chromium, and PFAS among them – that are linked to cancers, respiratory illnesses, developmental problems, and miscarriages. Exempting them from CEQA means communities might not know that such projects are going to be built nearby, and that projects could be approved even when they are sited near homes and schools. This defies common sense, and voters know it.",
      "The breadth of what voters want protected is also striking. More than four out of five believe that pesticide manufacturing, battery manufacturing, strip mining, oil refineries, and nuclear weapons manufacturing should all remain subject to CEQA safeguards. Under SB 131, they currently do not. Large majorities ranging from 71% to 79% say the same for nuclear energy plants, waste incineration, plastic fabrication, and data center facilities. This is not a narrow or ideological position. It is a broad, consistent mandate from the California public.",
      "(Methodology: FM3 Research conducted 820 online and telephone interviews with likely November 2026 California voters from March 5 through 11, 2026. Margin of sampling error: +/- 4.0% at the 95% confidence level.)",
      "Dr. Bonnie Hamilton is a pediatrician, mom, and community volunteer who practices pediatric medicine in Vallejo, California.",
    ],
  },
  {
    title:
      "California blew a hole in environmental planning law. Now, lawmakers are trying to fix it",
    source: "CalMatters",
    date: "March 27, 2026",
    author: "Alejandra Reyes-Velarde",
    summary:
      "State Sen. Catherine Blakespear introduced a bill seeking to more narrowly define what kinds of facilities are exempt from environmental review — after last year's rushed CEQA reforms created a loophole so broad that even a toxic battery recycling plant might qualify for a pass.",
    url: "https://calmatters.org/environment/2026/03/advanced-manufacturing-ceqa-reform-blakespear/",
    imageUrl: calmattersImg,
    body: [
      "Just south of downtown Los Angeles, the Exide battery recycling facility spent decades leaking lead and arsenic into the soil — sickening children, causing cancer, and creating a nearly billion-dollar liability for the state of California. A flurry of last-minute reforms to the California Environmental Quality Act at the end of last year's legislative session exempted a broad, poorly defined category of industrial facilities from environmental review – so broad that if Exide were proposed now, it might get a pass, critics say.",
      "Now lawmakers are trying to figure out what they actually meant when they approved those exemptions.",
      "State Sen. Catherine Blakespear, a Democrat who represents coastal San Diego and Orange counties, introduced a bill this week seeking to more narrowly define what kinds of facilities are exempt from environmental review and to add protections for communities near developments.",
      "But the bill deliberately leaves the hardest question unanswered: It doesn't specify which facilities qualify. Instead, it's a signal that this year's negotiations are beginning — and that last year's reforms may not stand.",
      "The idea was to incentivize innovative, clean energy businesses that would advance the state's climate goals. But in the rush, legislators pulled the definition of \"advanced manufacturing\" from the California Resource Code. The language was meant to identify businesses eligible for tax incentives, not to define environmental policy.",
      "The fight will pit environmental justice groups, who want maximum protection for communities near industrial sites, against industry leaders who say California can't meet its clean energy goals if every new manufacturing facility faces years of regulatory review.",
      "The definition includes everything from aerospace and electric vehicle manufacturing to stripmining and chemical recycling.",
      "Co-authors for Senate Bill 954 include former Senate President Pro Tem Mike McGuire, a Democrat from Santa Rosa who promised the fixes at the end of the last session, and Democratic Assemblymember Damon Connolly from San Rafael, who is working on a similar Assembly bill. Blakespear said the bill's authors are \"trying to do the balanced approach that we should have done, but we didn't.\"",
      "Last year, Gov. Gavin Newsom gave legislators an ultimatum: pass sweeping reforms of the state's environmental review law or he would withhold approval of the state's $321 billion spending plan.",
      "Legislators rushed to pass proposals exempting developments from environmental review, including housing, health clinics, food banks and advanced manufacturing.",
      "Under Blakespear's proposal, only facilities at the final stages of product manufacturing would qualify for the exemption. The bill would exclude raw materials processing and intermediate production. That includes the manufacturing of PFAS, a group of toxic chemicals linked to cancer and water contamination. Exempt facilities would have to advance certain climate, environmental and workforce goals.",
      "The bill would block the exemption for businesses located too close to a disadvantaged community or places where air pollution is already excessive. Those facilities would still go through full environmental review. The proposal also reinstates some classic CEQA requirements for exempt facilities. Those that will affect tribal resources will have to consult tribes on their developments.",
      "Last year's reforms also exempted day care centers in industrial areas from environmental review — the opposite of what legislators intended. Blakespear's proposal would limit the exemption to day care centers proposed in residential areas instead.",
      "So far, two advanced manufacturing facilities have qualified for the current law's CEQA exemption: a Google facility for quantum computing in Goleta and a research and development facility in Livermore testing fusion power as a clean energy source.",
      "Adrian Covert, senior vice president of public policy for the Bay Area Council, which represents businesses in the region, said California needs to become more competitive in manufacturing if it wants to meet climate goals. \"We have an opportunity to decarbonize manufacturing in the United States by bringing manufacturing into California and by making it easier to build manufacturing facilities in California,\" he said.",
      "One example of a company choosing to leave the state is Resynergi, a chemical recycling company that presented its technology as a solution to California's plastic waste problem. The company claims it can chemically heat plastic to make an oil that can be used to make new plastic, a process that researchers say generates toxic emissions. Resynergi chose to move to Texas after community pushback and questions from air regulators.",
      "For Covert, that proves California is driving away innovation. For environmental justice groups, however, the legacy of poorly scrutinized facilities like Exide weighs heavily. \"It's unclear if the net good of bringing these projects online immediately without any review will outweigh the huge negative health impacts they could have,\" Mason said.",
    ],
  },
];

const FeaturedArticleCard = ({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="group block w-full text-left">
    <Card className="transition-shadow hover:shadow-xl border-primary/30 overflow-hidden ring-1 ring-primary/20">
      {article.imageUrl && (
        <div className="w-full h-56 md:h-72 overflow-hidden relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground font-heading uppercase tracking-wider text-xs px-3 py-1 gap-1.5">
              <Star size={12} className="fill-current" />
              Featured Article
            </Badge>
          </div>
        </div>
      )}
      <CardContent className="p-6 md:p-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="font-semibold text-primary">{article.source}</span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>Opinion by {article.author}</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed text-base">
          {article.summary}
        </p>
        <div className="mt-5 flex items-center gap-1.5 text-primary font-heading text-sm uppercase tracking-wider">
          Read Full Article
        </div>
      </CardContent>
    </Card>
  </button>
);

const ArticleCard = ({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="group block w-full text-left">
    <Card className="transition-shadow hover:shadow-lg border-border overflow-hidden">
      {article.imageUrl && (
        <div className="w-full h-48 md:h-56 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
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
          Read Article
        </div>
      </CardContent>
    </Card>
  </button>
);

const InTheNews = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  const featuredArticle = articles.find((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight uppercase">
              <span className="text-foreground">In The </span>
              <span className="text-primary">News</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Coverage of the fight against the "advanced manufacturing"
              loophole and the push for SB 954 to restore CEQA protections for
              California communities.
            </p>
          </div>
        </section>

        <div className="caution-stripe h-3" />

        {/* Content with sidebar */}
        <section className="container py-12 md:py-20">
          <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
            {/* Articles */}
            <div className="flex-1 space-y-8">
              {/* Featured article always on top */}
              {featuredArticle && (
                <FeaturedArticleCard
                  article={featuredArticle}
                  onClick={() => setSelectedArticle(featuredArticle)}
                />
              )}

              {/* Other articles */}
              {otherArticles.map((article, i) => (
                <ArticleCard
                  key={i}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>

            {/* Sidebar - Article Index */}
            <aside className="md:w-72 shrink-0">
              <div className="sticky top-20">
                <h3 className="font-heading text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  All Articles
                </h3>
                <div className="space-y-3">
                  {articles.map((article, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedArticle(article)}
                      className="block w-full text-left group"
                    >
                      <div
                        className={`flex gap-3 items-start p-3 rounded-md hover:bg-secondary transition-colors ${article.featured ? "border border-primary/20 bg-primary/5" : ""}`}
                      >
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt=""
                            className="w-14 h-14 rounded object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          {article.featured && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0 mb-1"
                            >
                              Featured
                            </Badge>
                          )}
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {article.source} · {article.date}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 my-8 md:my-16 bg-card rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-background transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>

            {/* Article image */}
            {selectedArticle.imageUrl && (
              <div className="w-full h-64 md:h-80 overflow-hidden relative">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                {selectedArticle.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-heading uppercase tracking-wider text-xs px-3 py-1 gap-1.5">
                      <Star size={12} className="fill-current" />
                      Featured Article
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Article content */}
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-primary">
                  {selectedArticle.source}
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
              </div>

              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-6">
                {selectedArticle.title}
              </h2>

              <div className="prose prose-lg max-w-none text-foreground/90">
                {selectedArticle.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-heading text-sm uppercase tracking-wider hover:underline"
                >
                  Read on {selectedArticle.source} <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InTheNews;
