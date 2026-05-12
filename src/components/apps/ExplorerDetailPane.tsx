import { PROJECTS_METADATA, DEVOPS_METADATA } from '@/lib/projects-data';
import type { ProjectMetadata, DevopsAcademyMetadata } from '@/lib/projects-data';

interface ExplorerDetailPaneProps {
  slug: string | null;
}

type DetailData = ProjectMetadata | DevopsAcademyMetadata;

export function ExplorerDetailPane({ slug }: ExplorerDetailPaneProps) {
  if (!slug) return null;

  const data: DetailData | undefined = PROJECTS_METADATA[slug] ?? DEVOPS_METADATA[slug];

  if (!data) return null;

  const isProject = 'repoUrl' in data;
  const projectData = isProject ? (data as ProjectMetadata) : null;

  return (
    <div className="xp-detail-pane" role="region" aria-label="File details">
      <h2 className="xp-detail-title">{data.title}</h2>

      <p className="xp-detail-description">{data.description}</p>

      {projectData && (
        <>
          <div className="xp-detail-section">
            <span className="xp-detail-label">Language:</span>
            <span className="xp-detail-value">{projectData.language}</span>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Tech Stack:</span>
            <div className="xp-detail-badges">
              {projectData.techStack.map((tech) => (
                <span key={tech} className="xp-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Stars:</span>
            <span className="xp-detail-value">⭐ {projectData.stars}</span>
          </div>

          <div className="xp-detail-section">
            <span className="xp-detail-label">Last Commit:</span>
            <span className="xp-detail-value">{projectData.lastCommit}</span>
          </div>

          <div className="xp-detail-section">
            <a
              href={projectData.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="xp-button xp-button-repo"
            >
              View on GitHub
            </a>
          </div>
        </>
      )}

      {!isProject && (
        <>
          <div className="xp-detail-section">
            <span className="xp-detail-label">Category:</span>
            <span className="xp-detail-value">{(data as DevopsAcademyMetadata).category}</span>
          </div>
          <div className="xp-detail-section">
            <span className="xp-detail-label">Last Updated:</span>
            <span className="xp-detail-value">{(data as DevopsAcademyMetadata).lastUpdated}</span>
          </div>
        </>
      )}
    </div>
  );
}
