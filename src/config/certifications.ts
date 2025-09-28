/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string; // ISO date, e.g. "2025-06-01"
  expirationDate?: string; // ISO date
  credentialId?: string;
  url?: string; // verification link
  skills?: string[];
  issuerLogo?: string; // small issuer logo path
  certificateImage?: string; // certificate image preview
  certificatePdf?: string; // certificate pdf link
}

// edit certs
export const certifications: Certification[] = [
  {
    id: "ibm-intro-ai",
    title: "Introduction to Artificial Intelligence (AI)",
    issuer: "IBM",
    issueDate: "2025-09-04",
    credentialId: "1MXUZJ4Y79II",
    url: "https://www.coursera.org/account/accomplishments/verify/1MXUZJ4Y79II",
    skills: ["Artificial Intelligence (AI)", "Generative AI", "NLP"],
    issuerLogo: "/certificates/issuer/ibm_logo.jpg",
    certificateImage: "/certificates/IBM_AI_Yanis-Sebastian-Zürcher.pdf"
  },
  {
    id: "ibm-ml-python",
    title: "Machine Learning with Python",
    issuer: "IBM",
    issueDate: "2025-09-04",
    credentialId: "ADQLN32BTE5H",
    url: "https://www.coursera.org/account/accomplishments/verify/ADQLN32BTE5H",
    skills: ["Python", "Machine Learning", "Scikit-learn", "Regression", "Classification"],
    issuerLogo: "/certificates/issuer/ibm_logo.jpg",
    certificateImage: "/certificates/IBM_ML_Yanis-Sebastian-Zürcher.pdf"
  },
  {
    id: "cambridge-b2-fce",
    title: "B2 First (FCE)",
    issuer: "Cambridge English",
    issueDate: "2025-07-01",
    skills: ["English B2"],
    issuerLogo: "/certificates/issuer/cambridge_logo.jpg",
    certificateImage: "/certificates/b2-fce-cambridge_Yanis-Sebastian-Zürcher.pdf"
  },
  {
    id: "fcc-js-algorithms-ds",
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    issueDate: "2025-07-01",
    url: "https://www.freecodecamp.org/certification/lyfe691/javascript-algorithms-and-data-structures-v8",
    skills: ["JavaScript", "Algorithms", "Data Structures"],
    issuerLogo: "/certificates/issuer/free_code_camp_logo.jpg",
    certificateImage: "/certificates/js-fcc_algorithms-ds_Yanis-Sebastian-Zürcher.png"
  },
  {
    id: "mimo-fullstack",
    title: "Full-Stack Development",
    issuer: "Mimo",
    issueDate: "2025-02-01",
    credentialId: "56c5227a-95c9-4b7f-a462-8bf34303d644",
    url: "https://www.virtualbadge.io/certificate-validator?credential=56c5227a-95c9-4b7f-a462-8bf34303d644",
    skills: ["Full-Stack", "Web Development"],
    issuerLogo: "/certificates/issuer/mimo_logo.png",
    certificateImage: "/certificates/mimo_ft_Yanis-Sebastian-Zürcher.png"
  }
];

export function getAllCertifications(): Certification[] {
  return [...certifications].sort((a, b) => {
    const ad = new Date(a.issueDate).getTime();
    const bd = new Date(b.issueDate).getTime();
    return bd - ad; // newest first
  });
}

export function getCertificationsByIssuer(issuer: string): Certification[] {
  return getAllCertifications().filter((c) => c.issuer.toLowerCase() === issuer.toLowerCase());
}

export function isExpired(cert: Certification, now: Date = new Date()): boolean {
  if (!cert.expirationDate) return false;
  return new Date(cert.expirationDate).getTime() < now.getTime();
}


