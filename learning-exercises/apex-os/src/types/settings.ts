export type Settings = {
    businessName: string,
    phone: string,
    email: string,
    address: string,
    gstNumber: string,
    paymentDetails: string,
    reminderMessage: string,
    nextInvoiceNumber: number
}

export const defaultSettings: Settings = {
    businessName: "Apex Mobile Detailing",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    paymentDetails: "",
    reminderMessage: "Hi {first name},\n\nIt's been {months} since your {vehicle} was last detailed. Would you like to book it in?\n\nThanks,\n{business}",
    nextInvoiceNumber: 1001,
}
