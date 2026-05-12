export interface ProcessEntry {
  imageName: string;
  pid: number;
  cpu: number;
  memUsage: string;
  description: string;
}

export const PROCESS_DATA: ProcessEntry[] = [
  {
    imageName: 'python.exe',
    pid: 1204,
    cpu: 12,
    memUsage: '45,320 K',
    description: 'Python Runtime',
  },
  {
    imageName: 'terraform.svc',
    pid: 892,
    cpu: 8,
    memUsage: '32,100 K',
    description: 'Infrastructure Manager',
  },
  {
    imageName: 'docker.exe',
    pid: 2048,
    cpu: 15,
    memUsage: '128,400 K',
    description: 'Container Runtime',
  },
  { imageName: 'react.dll', pid: 1567, cpu: 6, memUsage: '22,800 K', description: 'UI Framework' },
  {
    imageName: 'node.exe',
    pid: 3201,
    cpu: 10,
    memUsage: '67,500 K',
    description: 'JavaScript Runtime',
  },
  { imageName: 'git.exe', pid: 445, cpu: 2, memUsage: '8,200 K', description: 'Version Control' },
  {
    imageName: 'linux_kernel',
    pid: 1,
    cpu: 18,
    memUsage: '256,000 K',
    description: 'Operating System',
  },
  {
    imageName: 'ansible.svc',
    pid: 780,
    cpu: 5,
    memUsage: '15,600 K',
    description: 'Configuration Mgmt',
  },
];

export const MAX_PERF_POINTS = 60;

/** Compute CPU performance base: average of all 8 process CPU values */
export const CPU_PERF_BASE = PROCESS_DATA.reduce((sum, p) => sum + p.cpu, 0) / PROCESS_DATA.length; // ~9.5%

/** Compute Memory performance base as overall percentage */
export const MEM_PERF_BASE = (() => {
  const sumMemK = PROCESS_DATA.reduce((sum, p) => {
    const num = parseInt(p.memUsage.replace(/,/g, ''), 10);
    return sum + num;
  }, 0);
  const maxMemK = 256000;
  return (sumMemK / (maxMemK * PROCESS_DATA.length)) * 100;
})(); // ~28.12%

export function initCpuPerfData(): number[] {
  return Array.from({ length: MAX_PERF_POINTS }, () => CPU_PERF_BASE + (Math.random() - 0.5) * 4);
}

export function initMemPerfData(): number[] {
  return Array.from({ length: MAX_PERF_POINTS }, () => MEM_PERF_BASE + (Math.random() - 0.5) * 4);
}
