
export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum GreenLabel {
  GREEN_LABEL_TH = 'Green Label (ฉลากเขียว)',
  CARBON_FOOTPRINT = 'Carbon Footprint',
  SCG_GREEN_CHOICE = 'SCG Green Choice',
  LEED = 'LEED Certified',
  NONE = 'None'
}

export enum Department {
  MANAGEMENT = 'ผู้บริหาร',
  GENERAL_ADMIN = 'งานบริหารงานทั่วไป',
  IT_RESOURCES = 'งานทรัพยากรสารสนเทศ',
  INFO_SERVICES = 'งานบริการสารสนเทศและส่งเสริมการเรียนรู้',
  IT_TECH = 'งานเทคโนโลยีสารสนเทศ'
}

export interface GreenInfo {
  isGreen: boolean;
  label: GreenLabel;
  proofImage?: string; // base64
}

export interface Order {
  id: string;
  createdAt: string;
  buyerName: string;
  department: Department | string;
  itemName: string;
  quantity: number;
  unit: string;
  specs: string;
  status: OrderStatus;
  greenInfo: GreenInfo;
  adminPrice?: number;
  adminNotes?: string;
  fiscalYear: number;
  calendarYear: number;
}
