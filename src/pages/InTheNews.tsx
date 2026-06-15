import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";
import calmattersImg from "@/assets/calmatters-article.png";
import capitolWeeklyImg from "@/assets/capitol-weekly-article.png";
import politicoImg from "@/assets/politico-california-climate.jpg";
import ocRegisterImg from "@/assets/ocregister-garden-grove.jpg";
import ocRegisterLogo from "@/assets/oc-register-logo.png";

type ArticleBlock =
  | string
  | { type: "highlight"; heading?: string; paragraphs: string[] };

interface NewsArticle {
  title: string;
  source: string;
  date: string;
  author: string;
  summary: string;
  url: string;
  imageUrl: string;
  body: ArticleBlock[];
  sourceLogoUrl?: string;
}

const articles: NewsArticle[] = [
  {
    title: "The climate primaries cometh",
    source: "POLITICO — California Climate",
    date: "May 26, 2026",
    author: "Alex Nieves, Camille von Kaenel and Noah Baustin",
    summary:
      "As California's June primary nears, Sen. Catherine Blakespear points to the weekend evacuation near an Orange County aerospace plant as a \"clear connection\" to her SB 954 push to restore environmental guardrails on advanced manufacturing.",
    url: "https://www.politico.com/newsletters/california-climate/2026/05/26/the-climate-primaries-cometh-00937438",
    imageUrl: politicoImg,
    body: [
      "POLITICO's California Climate newsletter surveys the energy and environmental fights shaping next week's June 2 primary — from oil-industry spending in statehouse races to a landmark data-center moratorium on the ballot in Monterey Park. Tucked into the day's \"What's Breaking\" section is a direct update on Sen. Catherine Blakespear's SB 954.",
      {
        type: "highlight",
        heading: "SB 954 Spotlight",
        paragraphs: [
          "THERE'S NOTHING LIKE AN EMERGENCY: A California Democrat is pointing to the evacuation of tens of thousands of people near an Orange County aerospace plant over the weekend as a warning against easing environmental rules.",
          "Sen. Catherine Blakespear told POLITICO on Tuesday that she sees a \"clear connection\" between the incident — sparked by fears of a chemical explosion at the Garden Grove facility — and her bill, SB 954.",
          "The bill would reinstate some guardrails for advanced manufacturing facilities after lawmakers scaled them back last year. Under Blakespear's proposal, future projects, including new aerospace manufacturing plants, could still skip some environmental review steps, but they would have to be located away from homes, schools and other sensitive sites, and meet certain labor and environmental standards.",
          "Several environmental groups support the measure but the California Chamber of Commerce, the Bay Area Council and manufacturing groups, which argue it would undercut an exemption meant to help build more industrial projects in the state, oppose it.",
          "\"We don't want there to [have to] be an explosion for people to say, oh wait, maybe we shouldn't have given an exemption … and then have people injured and evacuating, and potentially even dying, because we didn't protect our community,\" Blakespear said.",
        ],
      },
      "The Senate is expected to vote on SB 954 this week. Read the full newsletter on POLITICO for the rest of the day's California climate coverage.",
    ],
  },
  {
    title:
      "Community frustrations, concerns about lack of preparation aired at contentious Garden Grove meeting",
    source: "Orange County Register",
    date: "May 26, 2026",
    author: "Victoria Le and Claire Wang",
    summary:
      "After a weekend chemical scare evacuated 50,000 people near the GKN Aerospace plant, hundreds of residents packed Garden Grove's council chambers demanding answers about why a hazardous industrial use was allowed so close to homes and schools.",
    url: "https://www.ocregister.com/2026/05/26/community-frustrations-concerns-about-lack-of-preparation-aired-at-contentious-garden-grove-meeting/",
    imageUrl: ocRegisterImg,
    sourceLogoUrl: ocRegisterLogo,
    body: [
      "Having endured a turbulent weekend of evacuations prompted by a chemical scare, hundreds of Garden Grove residents packed the City's Council Chambers Tuesday night, May 26, to make clear their mounting outrage and concerns and to demand answers from elected officials and the company at the center of it all. The meeting turned contentious and ended with angry community members gathered outside.",
      "As residents and businesses looked ahead to the long Memorial Day weekend, an overheating chemical storage tank at GKN Aerospace in West Garden Grove containing methyl methacrylate instead triggered evacuation orders Friday for some 50,000 people as emergency crews sought to thwart a chemical reaction officials warned could prompt either a catastrophic blast or thousands of gallons of hazardous material spilling. While the emergency response quelled the threat of a violent explosion as of Monday night, 16,000 residents, largely from the city of Stanton, were still unable to return home until all evacuation orders were lifted Tuesday evening.",
      "\"We know it's a stressful and deeply disruptive experience,\" Mayor Stephanie Klopfenstein said during Tuesday's meeting. \"Some families had to leave their homes with very little notice. Some businesses had to close. Employees lost work hours. Parents had to explain to their children why they couldn't go home. Many people have been anxious, angry and uncertain about what comes next.\"",
      "Throughout the weekend, displaced residents and community leaders expressed outrage, some joining lawsuits against GKN Aerospace and pressing their elected officials to act, some saying there were \"more questions than answers\" regarding the incident. Tuesday night, community members demanded accountability over the handling of the evacuations and why the industrial use with stored hazardous chemicals was allowed so close to homes and schools.",
      "\"I was mentally prepared for natural disasters, but never for a military-industrial chemical leak. I never thought that something so dangerous is less than 2 miles away from me,\" evacuee Carrie Lynn told council members. \"Are there other companies in our area with similar dangers in our community?\" retired GGUSD Principal Sandi Ishii asked.",
      "Community members also raised concerns about the sheltering of those displaced, said communication was confusing, and that some experienced price gouging. \"We're seeing that the city, county and state have embarrassingly failed to meet the needs of those evacuated, to the community as a whole,\" Garden Grove resident Nathan Tran said, citing crowded shelters, too few beds, the cost of travel, and hotels \"eating at the pockets of already struggling, working families.\"",
      "Tensions escalated in the city chambers as the meeting went on, with councilmembers calling multiple recesses and eventually clearing the chambers after shouting matches ignited. While the council remained inside to finish the meeting, including approving a local emergency declaration, police were outside where a small mob gathered, yelling obscenities at the officers.",
      "Speakers raged at GKN Aerospace, with some questioning why representatives of the company weren't at the meeting. There were calls for the city to prohibit its continued operation in Garden Grove. \"It's been very devastating,\" evacuee Rodrigo Garay said. \"I ended up sleeping in my car the first day.\" Still, Garay left the evacuation shelter at Goldenwest College to press his elected representatives: \"There should be zero tolerance for GKN. From the local government all the way to the federal government, when this investigation happens, which it will happen, we want to make sure that there is no immunity (for GKN) and that they are held accountable.\"",
      "GKN Aerospace did not immediately respond to requests Tuesday night for comment, but in a previous statement the UK-based company had said: \"We are acutely aware of the uncertainty this incident is causing and sincerely apologise for the ongoing disruption to the local community.\"",
      "Cities are just starting to get a handle on the costs associated with the crisis. As of Monday, May 25, the city of Garden Grove \"reported approximately $728,000 in incident-related costs to OCFA,\" city spokesperson Jonathan Garcia said. The figure does not include the costs of supplies, materials, vehicle-related expenses or the 1,250 gallons of water per minute that were being sprayed onto the overheating tank for five days before officials removed the hose. As for which agency would inherit the bill for the approximate 9 million gallons of water, Garcia said, \"That's one of the unknowns. We just don't know at this point.\"",
      "Earlier in the afternoon, Rep. Derek Tran, whose district includes the evacuated neighborhoods, held a community meeting and resource fair at Cal State Fullerton, reiterating his call for state and federal investigation and accountability. \"I know many of you are frustrated and angry, and I share those feelings wholeheartedly,\" Tran said. \"You all deserve answers for how it all happened. Accountability matters.\"",
      "OCFA Interim Fire Chief TJ McGovern urged residents still in the remaining evacuation zone to stay cautious, explaining that though the threat of a larger-scale explosion had been eliminated, the risk of fire and a potential spill remained. \"I know it's a challenge for all of you to be displaced … but we cannot allow you to go home if there's still a fire risk out there,\" McGovern said.",
    ],
  },
  {
    title: "Voters oppose advanced manufacturing CEQA exemptions",
    source: "Capitol Weekly",
    date: "April 6, 2026",
    author: "Bonnie Hamilton",
    summary:
      "A new statewide poll finds 64% of voters would hold it against lawmakers who approved exemptions for polluting industries near homes and schools.",
    url: "https://capitolweekly.net/voters-oppose-advanced-manufacturing-ceqa-exemptions/",
    imageUrl: capitolWeeklyImg,
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
              {articles.map((article, i) => (
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
                      <div className="flex gap-3 items-start p-3 rounded-md hover:bg-secondary transition-colors">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt=""
                            className="w-14 h-14 rounded object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
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
              </div>
            )}

            {/* Article content */}
            <div className="p-6 md:p-10">
              {selectedArticle.sourceLogoUrl && (
                <div className="mb-6 pb-6 border-b border-border flex justify-center">
                  <img
                    src={selectedArticle.sourceLogoUrl}
                    alt={`${selectedArticle.source} logo`}
                    loading="lazy"
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </div>
              )}
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
                {selectedArticle.body.map((block, i) => {
                  if (typeof block === "string") {
                    return (
                      <p
                        key={i}
                        className="mb-4 leading-relaxed text-muted-foreground"
                      >
                        {block}
                      </p>
                    );
                  }
                  return (
                    <aside
                      key={i}
                      className="my-6 border-l-4 border-primary bg-primary/5 rounded-r-lg p-5 md:p-6"
                    >
                      {block.heading && (
                        <h3 className="font-heading text-xs uppercase tracking-widest text-primary mb-3 mt-0">
                          {block.heading}
                        </h3>
                      )}
                      {block.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          className="mb-3 last:mb-0 leading-relaxed text-foreground/90"
                        >
                          {p}
                        </p>
                      ))}
                    </aside>
                  );
                })}
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
