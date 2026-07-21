import type { ImpactStory } from "@/types/portfolio";

export const impactStories = [
  {
    kicker: "Personalisation platform",
    title: "Scaled taste profiles from 400,000 to more than 70 million",
    description:
      "Expanded a reusable taste-personalisation platform across whisky, beer, tequila and cocktail experiences, backed by Java services, search and machine-learning endpoints.",
  },
  {
    kicker: "Platform modernisation",
    title: "Led AWS migration work that saved more than $1 million",
    description:
      "Moved services toward CDK-based infrastructure as code, improved monitoring and reduced platform complexity while keeping production systems stable.",
  },
  {
    kicker: "Engineering standards",
    title: "Raised automated test coverage from zero to more than 80%",
    description:
      "Established pull request review processes, built CI/CD pipelines from scratch, added SonarQube quality gates, and introduced ADRs plus automated unit, integration and acceptance testing across a portfolio of services.",
  },
  {
    kicker: "Connected devices",
    title: "Built backend services for reusable-keg and dispenser data",
    description:
      "Delivered Java, Spring Boot, Lambda, Glue and DynamoDB services supporting a mobile app and connected drinks-dispensing platform used by bars.",
  },
  {
    kicker: "Applied AI",
    title: "Integrated LLMs into a consumer-research platform",
    description:
      "Led development of an AI research platform used to gather consumer feedback for product development, including prompt design and secure API integration.",
  },
] as const satisfies readonly ImpactStory[];
