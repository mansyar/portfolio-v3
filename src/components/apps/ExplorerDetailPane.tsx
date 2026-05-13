import projectsContent from '@/lib/generated/projects-content.json';
import { ARTICLES_METADATA } from '@/lib/projects-data';
import type { ArticleMetadata } from '@/lib/projects-data';

interface ExplorerDetailPaneProps {
  slug: string | null;
}

/**
 * Shape of each entry in projects-content.json.
 * Subset of the full frontmatter fields relevant to the detail pane.
 */
interface ProjectEntryFrontmatter {
  title: string;
  description: string;
  repoUrl: string;
  language: string;
  techStack: string[];
  stars: number;
  lastCommit: string;
  commits: number;
  status: string;
  icon: string;
  slug: string;
  drive: string;
}

interface ProjectEntry {
  frontmatter: ProjectEntryFrontmatter;
  bodyHtml: string;
}

type ProjectsContentMap = Record<string, ProjectEntry>;

export function ExplorerDetailPane({ slug }: ExplorerDetailPaneProps) {
  if (!slug) return null;

  // Try projects content first (includes bodyHtml + live GitHub data)
  const projects = projectsContent as unknown as ProjectsContentMap;
  const projectEntry: ProjectEntry | undefined = projects[slug];

  // Fallback to articles metadata
  const articleData: ArticleMetadata | undefined = ARTICLES_METADATA[slug];

  if (!projectEntry && !articleData) return null;

  return (
    <div className="xp-detail-pane" role="region" aria-label="File details">
      {projectEntry && (
        <>
          {/* ── Metadata header ───────────────────────────── */}
          <h2 className="xp-detail-title">{projectEntry.frontmatter.title}</h2>
          <p className="xp-detail-description">{projectEntry.frontmatter.description}</p>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Language:</span>
            <span className="xp-detail-value">{projectEntry.frontmatter.language}</span>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Tech Stack:</span>
            <div className="xp-detail-badges">
              {projectEntry.frontmatter.techStack.map((tech: string) => (
                <span key={tech} className="xp-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Stars:</span>
            <span className="xp-detail-value">⭐ {projectEntry.frontmatter.stars}</span>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Commits:</span>
            <span className="xp-detail-value">{projectEntry.frontmatter.commits}</span>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Last Commit:</span>
            <span className="xp-detail-value">{projectEntry.frontmatter.lastCommit}</span>
          </div>

          <div className="xp-detail-section">
            <a
              href={projectEntry.frontmatter.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="xp-button xp-button-repo"
            >
              View on GitHub
            </a>
          </div>

          {/* ── Body HTML (rendered from MDX) ─────────────── */}
          <div
            className="xp-detail-body"
            dangerouslySetInnerHTML={{ __html: projectEntry.bodyHtml }}
          />
        </>
      )}

      {articleData && (
        <>
          <h2 className="xp-detail-title">{articleData.title}</h2>
          <p className="xp-detail-description">{articleData.description}</p>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Category:</span>
            <span className="xp-detail-value">{articleData.category}</span>
          </div>
          <div className="xp-detail-section">
            <span className="xp-detail-label">Last Updated:</span>
            <span className="xp-detail-value">{articleData.lastUpdated}</span>
          </div>
        </>
      )}
    </div>
  );
}
