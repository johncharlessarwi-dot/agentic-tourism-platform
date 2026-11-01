"use client";

import { useState, type FormEvent } from "react";

const whatsappNumber = "255698170989";

/** Creates a guest-controlled WhatsApp draft; no automatic submission. */
export function EnquiryForm() {
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travellers, setTravellers] = useState(1);

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello SafariOS / John Online Services, I would like tourism assistance.",
      `Destination: ${destination.trim()}`,
      `Travellers: ${travellers}`,
      travelDate ? `Preferred travel date: ${travelDate}` : "Travel dates: flexible",
      "Please share available options and next steps.",
    ].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="enquiry-form" onSubmit={prepareMessage}>
      <label>Where would you like to go?
        <input required maxLength={120} minLength={2} value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="e.g. Kilimanjaro or Serengeti" />
      </label>
      <label>Preferred travel date (optional)
        <input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} />
      </label>
      <label>Number of travellers
        <input required type="number" min={1} max={100} value={travellers} onChange={(event) => setTravellers(Number(event.target.value))} />
      </label>
      <button type="submit" className="primary">Prepare WhatsApp enquiry ↗</button>
      <p className="form-note">A new WhatsApp window opens with your draft. You choose whether to send it. No booking or price is confirmed here.</p>
    </form>
  );
}
