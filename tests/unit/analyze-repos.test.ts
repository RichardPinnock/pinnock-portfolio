import { describe, expect, it } from "vitest";
import {
  classify,
  detectTechnologies,
  type RepoFiles,
} from "../../scripts/analyze-repos-lib.ts";

const empty: RepoFiles = {
  rootFiles: [],
  packageJson: null,
  requirementsTxt: null,
  composerJson: null,
};

describe("detectTechnologies", () => {
  it("reads dependencies and devDependencies from package.json", () => {
    const techs = detectTechnologies(
      {
        ...empty,
        packageJson: {
          dependencies: { next: "16", react: "19" },
          devDependencies: { tailwindcss: "4", typescript: "5" },
        },
      },
      "TypeScript",
    );
    expect(techs).toEqual(["Next.js", "React", "Tailwind CSS", "TypeScript"]);
  });

  it("reads Python packages ignoring versions and extras", () => {
    const techs = detectTechnologies(
      {
        ...empty,
        requirementsTxt:
          "fastapi==0.110\nSQLAlchemy>=2\nuvicorn[standard]\n# comment",
      },
      "Python",
    );
    expect(techs).toEqual(["FastAPI", "SQLAlchemy"]);
  });

  it("detects Docker and Odoo from root files", () => {
    expect(
      detectTechnologies(
        { ...empty, rootFiles: ["Dockerfile", "__manifest__.py"] },
        null,
      ),
    ).toEqual(["Docker", "Odoo"]);
  });

  it("falls back to the primary language when nothing else is recognised", () => {
    expect(detectTechnologies(empty, "Python")).toEqual(["Python"]);
    expect(detectTechnologies(empty, null)).toEqual([]);
  });
});

describe("classify", () => {
  it("prefers mobile over web for React Native apps", () => {
    expect(classify(["React", "React Native", "Expo"], "app", null)).toBe(
      "mobile",
    );
  });

  it("classifies frontend frameworks as web apps", () => {
    expect(classify(["Next.js", "React"], "site", null)).toBe("web-apps");
  });

  it("classifies backend-only stacks as integrations", () => {
    expect(classify(["NestJS", "Prisma"], "api", null)).toBe("integrations");
  });

  it("detects ERP/CRM from the repo name even when separated by underscores", () => {
    expect(classify(["Python"], "client_odoo_addons", null)).toBe("crm-erp");
    expect(classify(["TypeScript"], "mycrm", null)).toBe("tools");
  });

  it("classifies messaging bots as integrations before web apps", () => {
    expect(classify(["Express", "WhatsApp"], "bot", null)).toBe("integrations");
  });

  it("classifies Docker-only repos as devops and unknowns as tools", () => {
    expect(classify(["Docker"], "infra", null)).toBe("devops");
    expect(classify(["Shell"], "scripts", null)).toBe("tools");
  });
});
