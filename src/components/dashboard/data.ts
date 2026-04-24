import type { ReportStatus, FileStatus } from "./StatusBadge";

export interface Intervention {
  id: string;
  number: string;
  client: string;
  location: string;
  plannedDate: string;
  engineer: string;
  endDate: string;
  reportStatus: ReportStatus;
  fileStatus: FileStatus;
}

export const interventions: Intervention[] = [
  { id: "1", number: "INT-2025-001", client: "Acme Industries", location: "Paris", plannedDate: "2025-04-12", engineer: "Sophie Martin", endDate: "2025-04-13", reportStatus: "Fait", fileStatus: "Fait" },
  { id: "2", number: "INT-2025-002", client: "Globex Corp", location: "Lyon", plannedDate: "2025-04-14", engineer: "Lucas Dubois", endDate: "2025-04-15", reportStatus: "Fait", fileStatus: "En attente de facturation" },
  { id: "3", number: "INT-2025-003", client: "Initech", location: "Marseille", plannedDate: "2025-04-16", engineer: "Emma Laurent", endDate: "2025-04-17", reportStatus: "En attente", fileStatus: "En attente de facturation" },
  { id: "4", number: "INT-2025-004", client: "Umbrella SA", location: "Toulouse", plannedDate: "2025-04-18", engineer: "Sophie Martin", endDate: "2025-04-19", reportStatus: "En attente", fileStatus: "En attente de facturation" },
  { id: "5", number: "INT-2025-005", client: "Stark Energy", location: "Nice", plannedDate: "2025-04-19", engineer: "Hugo Bernard", endDate: "2025-04-20", reportStatus: "Fait", fileStatus: "Fait" },
  { id: "6", number: "INT-2025-006", client: "Wayne Tech", location: "Nantes", plannedDate: "2025-04-20", engineer: "Lucas Dubois", endDate: "2025-04-21", reportStatus: "Fait", fileStatus: "En attente de facturation" },
  { id: "7", number: "INT-2025-007", client: "Acme Industries", location: "Bordeaux", plannedDate: "2025-04-21", engineer: "Emma Laurent", endDate: "2025-04-22", reportStatus: "En attente", fileStatus: "En attente de facturation" },
  { id: "8", number: "INT-2025-008", client: "Soylent Corp", location: "Lille", plannedDate: "2025-04-22", engineer: "Hugo Bernard", endDate: "2025-04-24", reportStatus: "Fait", fileStatus: "Fait" },
  { id: "9", number: "INT-2025-009", client: "Hooli", location: "Rennes", plannedDate: "2025-04-23", engineer: "Sophie Martin", endDate: "2025-04-24", reportStatus: "En attente", fileStatus: "En attente de facturation" },
  { id: "10", number: "INT-2025-010", client: "Pied Piper", location: "Grenoble", plannedDate: "2025-04-25", engineer: "Lucas Dubois", endDate: "2025-04-26", reportStatus: "Fait", fileStatus: "En attente de facturation" },
  { id: "11", number: "INT-2025-011", client: "Globex Corp", location: "Strasbourg", plannedDate: "2025-04-26", engineer: "Emma Laurent", endDate: "2025-04-27", reportStatus: "En attente", fileStatus: "En attente de facturation" },
  { id: "12", number: "INT-2025-012", client: "Stark Energy", location: "Montpellier", plannedDate: "2025-04-28", engineer: "Hugo Bernard", endDate: "2025-04-29", reportStatus: "Fait", fileStatus: "Fait" },
];
