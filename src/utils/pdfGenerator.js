import jsPDF from "jspdf";

const PAGE = {
  width: 210,
  height: 297,
  marginX: 20,
  contentWidth: 170,
  footerTop: 285,
  footerY: 290,
};

const COLORS = {
  ink: [15, 23, 42],
  steel: [71, 85, 105],
  muted: [100, 116, 139],
  accent: [18, 52, 86],
  accentDark: [10, 31, 52],
  accentSoft: [232, 238, 245],
  gold: [181, 138, 76],
  goldSoft: [246, 240, 229],
  line: [214, 223, 233],
  panel: [248, 250, 252],
  zebra: [243, 247, 251],
  white: [255, 255, 255],
};

const formatDate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().split("T")[0];
};

const formatTripDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

const formatTripDateTime = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} • ${timePart}`;
};

const formatMoney = (value = 0) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatWholeDays = (value = 0) => Math.max(0, Math.ceil(Number(value || 0)));

const formatHours = (value = 0) => {
  const hours = Number(value || 0);

  if (!Number.isFinite(hours)) return "0 hrs";

  return `${hours.toFixed(2).replace(/\.?0+$/, "")} hrs`;
};

const formatHHMM = (value = 0) => {
  const totalMinutes = Math.round(Number(value || 0));
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}:${String(mins).padStart(2, "0")} hrs`;
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
  });

const canUseImage = (image) => image?.complete && image.naturalWidth !== 0;

const ensureSpace = (doc, state, neededHeight, top = 22) => {
  if (state.y + neededHeight > PAGE.footerTop - 8) {
    doc.addPage();
    state.y = top;
    state.boxStarted = false;
  }
};

const drawTextPair = (
  doc,
  label,
  value,
  x,
  y,
  width = 70,
  {
    labelSize = 7.1,
    valueSize = 8.4,
    valueOffset = 3.5,
  } = {},
) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(labelSize);
  doc.setTextColor(...COLORS.steel);
  doc.text(label.toUpperCase(), x, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(valueSize);
  doc.setTextColor(...COLORS.ink);
  const lines = doc.splitTextToSize(value || "-", width);
  doc.text(lines, x, y + valueOffset);
  return lines.length;
};

const getTextPairHeight = (
  doc,
  value,
  width = 70,
  {
    blockTop = 5.2,
    lineHeight = 3.2,
  } = {},
) => {
  const lines = doc.splitTextToSize(value || "-", width);
  return blockTop + lines.length * lineHeight;
};

const addPageFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.setDrawColor(...COLORS.line);
    doc.line(PAGE.marginX, PAGE.footerTop, 190, PAGE.footerTop);
    doc.text("Red Sky Group", PAGE.marginX, PAGE.footerY);
    doc.text(`Page ${i} of ${pageCount}`, 190, PAGE.footerY, {
      align: "right",
    });
  }

  doc.setTextColor(...COLORS.ink);
};

const drawVerticalBrand = (doc, text = "RED SKY GROUP PRIVATE AVIATION") => {
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.6);
  doc.line(197, 62, 197, 244);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.gold);
  doc.text(text, 201, 238, { angle: 90 });
  doc.setTextColor(...COLORS.ink);
};

const drawSectionTitle = (doc, title, x, y) => {
  doc.setFillColor(...COLORS.gold);
  doc.roundedRect(x, y - 4.2, 2, 7, 0.7, 0.7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.ink);
  doc.text(title, x + 5, y);
};

const drawTermsBox = (doc, top) => {
  const height = PAGE.footerTop - top - 8;

  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(PAGE.marginX, top, PAGE.contentWidth, height, 3, 3, "FD");
  doc.setFillColor(...COLORS.goldSoft);
  doc.roundedRect(PAGE.marginX + 4, top + 4, 3, height - 8, 1, 1, "F");
};

const addSectionText = (doc, state, title, text) => {
  const paragraphs = String(text || "")
    .split("\n")
    .filter(Boolean);
  const contentLines = paragraphs.flatMap((paragraph) =>
    doc.splitTextToSize(paragraph.replace(/^- /, "- "), PAGE.contentWidth - 21),
  );
  const blockHeight = 5.2 + contentLines.length * 3.7 + paragraphs.length * 0.25;

  ensureSpace(doc, state, blockHeight, 22);

  if (!state.boxStarted) {
    drawTermsBox(doc, state.y);
    state.y += 8;
    state.boxStarted = true;
  } else {
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(PAGE.marginX + 11, state.y - 0.9, 184, state.y - 0.9);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.ink);
  doc.text(title, PAGE.marginX + 11, state.y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.9);
  doc.setTextColor(...COLORS.steel);

  let textY = state.y + 4.2;
  paragraphs.forEach((paragraph) => {
    const lines = doc.splitTextToSize(
      paragraph.replace(/^- /, "- "),
      PAGE.contentWidth - 21,
    );
    doc.text(lines, PAGE.marginX + 11, textY);
    textY += lines.length * 3.7 + 0.25;
  });

  state.y = textY + 1.1;
};

const getRoutePath = (routes = []) => {
  if (!routes.length) return "-";

  const path = [];

  routes.forEach((route, index) => {
    const fromAirport = route?.fromAirport || "-";
    const toAirport = route?.toAirport || "-";

    if (index === 0) {
      path.push(fromAirport, toAirport);
      return;
    }

    if (path[path.length - 1] !== fromAirport) {
      path.push(fromAirport);
    }

    path.push(toAirport);
  });

  return path.join("-");
};

const getLegTypeLabel = (route) => {
  if (route?.positioningType === "return_to_base") return "RETURN TO BASE";
  if (route?.positioning) return "REPOSITIONING";
  return "CLIENT LEG";
};

export const generateReservationPDF = async ({
  form,
  routes,
  breakdowns = [],
  pricingSummary = null,
  tripDates = {},
  totals,
  getAircraftName,
  getAircraftById,
  getRouteAirportDisplay,
}) => {
  const doc = new jsPDF({ compress: true });
  const firstCustomerRoute = routes.find((route) => !route?.positioning) || routes[0] || {};
  const aircraft = getAircraftById?.(firstCustomerRoute.aircraft_id) || null;
  const aircraftName =
    aircraft?.name || getAircraftName?.(firstCustomerRoute.aircraft_id) || "-";
  const pax = aircraft?.capacity_passengers || firstCustomerRoute.passengers || 0;
  const totalNights = breakdowns.reduce(
    (sum, item) => sum + formatWholeDays(item.nights),
    0,
  );
  const totalFlightTime = pricingSummary?.totals?.flightTime ?? 0;
  const totalFlightTimeMinutes = pricingSummary?.totals?.flightTimeMinutes ?? 0;
  const tripStartDateLabel = formatTripDateTime(tripDates?.tripStartDate) || "-";
  const tripEndDateLabel = formatTripDateTime(tripDates?.tripEndDate) || "-";
  const hasDistinctReturnDate =
    Boolean(tripDates?.tripEndDate) && tripStartDateLabel !== tripEndDateLabel;

  const logo = await loadImage(`${import.meta.env.BASE_URL}images/logo.png`);
  const secondaryLogo = await loadImage(`${import.meta.env.BASE_URL}images/logoo.png`);

  doc.setFillColor(...COLORS.white);
  doc.rect(0, 0, PAGE.width, 56, "F");
  doc.setFillColor(...COLORS.accentDark);
  doc.rect(0, 0, PAGE.width, 9, "F");
  doc.setFillColor(...COLORS.gold);
  doc.rect(0, 9, PAGE.width, 1.2, "F");

  if (canUseImage(logo)) {
    doc.addImage(logo, "PNG", 18, 10, 54, 36);
  }

  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(142, 13, 48, 24, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...COLORS.accentSoft);
  doc.text("DATE", 147, 21);
  doc.text("DOCUMENT", 147, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text(formatDate(), 186, 21, { align: "right" });
  doc.text("Reservation", 186, 30, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...COLORS.ink);
  doc.text("Executive Flight Quote", 20, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.steel);
  doc.text("Professional private aviation quotation", 20, 52);

  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.4);
  doc.line(20, 58, 190, 58);
  drawVerticalBrand(doc);

  const clientRows = [
    ["Name", form.name || "-"],
    ["Email", form.email || "-"],
    ["Phone", form.phone || "-"],
  ];
  const profileRows = [
    ["Aircraft", aircraftName],
    ["Route", getRoutePath(routes)],
  ];

  const cardTop = 64;
  const cardPaddingX = 6;
  const cardPaddingTop = 7.5;
  const cardPaddingBottom = 5.5;
  const cardTitleY = cardTop + cardPaddingTop + 2.8;
  const cardBodyStartY = cardTitleY + 7;
  const cardFieldGap = 0.8;
  const tripSummaryGap = 2.2;
  const tripSummaryLabelSize = 7.1;
  const tripSummaryValueSize = 8.4;
  const tripSummaryValueOffset = 3;
  const tripSummaryLineHeight = 3;
  const tripSummaryColumnWidth = hasDistinctReturnDate ? 28 : 66;
  const cardTextOptions = {
    labelSize: 7.1,
    valueSize: 8.4,
    valueOffset: 3,
  };
  const cardHeightOptions = {
    blockTop: 4.8,
    lineHeight: 3,
  };

  const getCardHeight = (rows, width) => {
    let height = cardBodyStartY - cardTop;
    rows.forEach(([, value]) => {
      height += getTextPairHeight(doc, value, width, cardHeightOptions) + cardFieldGap;
    });
    height -= cardFieldGap;
    return height + cardPaddingBottom;
  };

  const tripSummaryHeight = (() => {
    const startLines = doc.splitTextToSize(tripStartDateLabel, tripSummaryColumnWidth);
    const endLines = doc.splitTextToSize(tripEndDateLabel, tripSummaryColumnWidth);
    const maxLines = hasDistinctReturnDate
      ? Math.max(startLines.length, endLines.length)
      : startLines.length;
    return 5.2 + maxLines * tripSummaryLineHeight;
  })();
  const profileBaseHeight =
    getCardHeight(profileRows, 68) - cardPaddingBottom;
  const profileCardHeight =
    profileBaseHeight + tripSummaryGap + tripSummaryHeight + cardPaddingBottom;
  const cardHeight = Math.max(
    getCardHeight(clientRows, 68),
    profileCardHeight,
  );

  doc.setFillColor(...COLORS.panel);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(20, cardTop, 82, cardHeight, 4, 4, "FD");
  doc.roundedRect(108, cardTop, 82, cardHeight, 4, 4, "FD");
  doc.setFillColor(...COLORS.gold);
  doc.rect(20, cardTop, 82, 1.4, "F");
  doc.rect(108, cardTop, 82, 1.4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.ink);
  doc.text("Client Information", 20 + cardPaddingX, cardTitleY);
  doc.text("Trip Profile", 108 + cardPaddingX, cardTitleY);

  let clientY = cardBodyStartY;
  clientRows.forEach(([label, value]) => {
    const usedLines = drawTextPair(
      doc,
      label,
      value,
      20 + cardPaddingX,
      clientY,
      68,
      cardTextOptions,
    );
    clientY +=
      getTextPairHeight(doc, value, 68, cardHeightOptions) + cardFieldGap;
  });

  let profileY = cardBodyStartY;
  profileRows.forEach(([label, value]) => {
    drawTextPair(
      doc,
      label,
      value,
      108 + cardPaddingX,
      profileY,
      68,
      cardTextOptions,
    );
    profileY +=
      getTextPairHeight(doc, value, 68, cardHeightOptions) + cardFieldGap;
  });

  profileY += tripSummaryGap;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(tripSummaryLabelSize);
  doc.setTextColor(...COLORS.steel);
  doc.text("DEPARTURE DATE", 108 + cardPaddingX, profileY);
  if (hasDistinctReturnDate) {
    doc.text("RETURN DATE", 108 + cardPaddingX + 40, profileY);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(tripSummaryValueSize);
  doc.setTextColor(...COLORS.ink);
  doc.text(
    doc.splitTextToSize(tripStartDateLabel, tripSummaryColumnWidth),
    108 + cardPaddingX,
    profileY + tripSummaryValueOffset,
  );
  if (hasDistinctReturnDate) {
    doc.text(
      doc.splitTextToSize(tripEndDateLabel, tripSummaryColumnWidth),
      108 + cardPaddingX + 40,
      profileY + tripSummaryValueOffset,
    );
  }

  let y = cardTop + cardHeight + 5;

  drawSectionTitle(doc, "Flight Legs", 20, y);
  y += 7;

  doc.setFillColor(...COLORS.accentSoft);
  doc.roundedRect(20, y, 170, 9, 2, 2, "F");
  doc.setTextColor(...COLORS.accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.1);
  doc.text("#", 25, y + 5.9);
  doc.text("TYPE", 37, y + 5.9);
  doc.text("DEPARTURE", 58, y + 5.9);
  doc.text("ARRIVAL", 111, y + 5.9);
  doc.text("DIST (NM)", 166, y + 5.9, { align: "right" });
  doc.text("TIME", 181, y + 5.9, { align: "right" });
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.ink);

  routes.forEach((route, index) => {
    const miles = breakdowns[index]?.miles || 0;
    const hours = breakdowns[index]?.hours || 0;
    const estimatedHHMM = breakdowns[index]?.estimatedHHMM || formatHours(hours);
    const typeLabel = getLegTypeLabel(route);
    const typeFontSize = typeLabel.length > 12 ? 4.6 : 5.2;
    const departureLabel = getRouteAirportDisplay?.(route, "from") || route.fromAirport || "-";
    const arrivalLabel = getRouteAirportDisplay?.(route, "to") || route.toAirport || "-";
    const fromText = doc.splitTextToSize(departureLabel, 47);
    const toText = doc.splitTextToSize(arrivalLabel, 47);
    const rowHeight =
      Math.max(fromText.length, toText.length) * 3.9 + 5.4;
    const typeFill =
      route?.positioningType === "return_to_base"
        ? COLORS.goldSoft
        : route?.positioning
          ? [252, 240, 204]
          : COLORS.white;

    if (index % 2 === 0) {
      doc.setFillColor(...COLORS.zebra);
      doc.rect(20, y, 170, rowHeight, "F");
    }

    doc.setFontSize(8.1);
    doc.text(String(index + 1), 25, y + 5.4);
    doc.setFillColor(...typeFill);
    doc.roundedRect(33, y + 1.6, 18, rowHeight - 3.2, 1.2, 1.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(typeFontSize);
    doc.setTextColor(...COLORS.accent);
    doc.text(typeLabel, 42, y + 5.2, { align: "center", maxWidth: 16.5 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.1);
    doc.setTextColor(...COLORS.ink);
    doc.text(fromText, 56, y + 5.4);
    doc.text(toText, 109, y + 5.4);
    doc.text(
      Number(miles).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      166,
      y + 5.4,
      { align: "right" },
    );
    doc.text(estimatedHHMM, 181, y + 5.4, { align: "right" });

    doc.setDrawColor(...COLORS.line);
    doc.line(20, y + rowHeight, 190, y + rowHeight);
    y += rowHeight;
  });

  y += 4;

  drawSectionTitle(doc, "Commercial Breakdown", 20, y);
  y += 6;

  const costRows = [
    ["Flight Cost", totals.flight],
    ["Overnight Crew", totals.overnight],
    ["Operational Expenses", totals.expenses],
    ["Subtotal", totals.subtotal],
  ];
  const remainingSpace = PAGE.footerTop - 6 - y;
  const compactCommercial = remainingSpace < 56;
  const tableHeaderHeight = compactCommercial ? 8 : 10;
  const rowHeight = compactCommercial ? 7.1 : 8.4;
  const totalBoxHeight = compactCommercial ? 19 : 22;
  const costBoxHeight = 6 + tableHeaderHeight + costRows.length * rowHeight - 1;

  doc.setFillColor(...COLORS.panel);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.25);
  doc.roundedRect(20, y, 170, costBoxHeight, 4, 4, "FD");
  doc.setFillColor(...COLORS.accentSoft);
  doc.roundedRect(24, y + 3, 162, tableHeaderHeight, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(compactCommercial ? 7.1 : 7.8);
  doc.setTextColor(...COLORS.accent);
  doc.text("DESCRIPTION", 29, y + 3 + tableHeaderHeight / 2 + 1.4);
  doc.text("AMOUNT", 181, y + 3 + tableHeaderHeight / 2 + 1.4, { align: "right" });

  let rowY = y + 5.8 + tableHeaderHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(compactCommercial ? 7.7 : 8.7);
  doc.setTextColor(...COLORS.ink);

  costRows.forEach(([label, value], index) => {
    doc.setFillColor(...(index % 2 === 0 ? COLORS.white : COLORS.zebra));
    doc.roundedRect(24, rowY - rowHeight + 1.6, 162, rowHeight - 0.5, 1.5, 1.5, "F");

    doc.text(label, 29, rowY);
    doc.setFont("helvetica", "bold");
    doc.text(formatMoney(value), 181, rowY, { align: "right" });
    doc.setFont("helvetica", "normal");
    rowY += rowHeight;
  });

  y += costBoxHeight + 3;

  const maxTotalY = PAGE.footerTop - totalBoxHeight - 1.5;
  y = Math.min(y, maxTotalY);

  doc.setFillColor(...COLORS.accentDark);
  doc.roundedRect(20, y, 170, totalBoxHeight, 4, 4, "F");
  doc.setFillColor(...COLORS.gold);
  doc.rect(20, y, 170, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(compactCommercial ? 7.4 : 8.2);
  doc.setTextColor(...COLORS.goldSoft);
  doc.text("TOTAL ESTIMATED BALANCE", 26, y + (compactCommercial ? 7.5 : 8.5));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(compactCommercial ? 6.5 : 7.1);
  doc.setTextColor(...COLORS.accentSoft);
  doc.text(
    `Estimated in USD - Estimated flight time ${formatHHMM(totalFlightTimeMinutes) || formatHours(totalFlightTime)}`,
    26,
    y + (compactCommercial ? 13 : 15),
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(compactCommercial ? 17.5 : 19.5);
  doc.setTextColor(...COLORS.white);
  doc.text(`${formatMoney(totals.total)} USD`, 185, y + (compactCommercial ? 14.5 : 15.5), {
    align: "right",
  });

  doc.addPage();
  const termsState = { y: 38 };

  doc.setFillColor(...COLORS.accentDark);
  doc.rect(0, 0, PAGE.width, 12, "F");
  doc.setFillColor(...COLORS.gold);
  doc.rect(0, 12, PAGE.width, 1.2, "F");
  if (canUseImage(secondaryLogo || logo)) {
    doc.addImage(secondaryLogo || logo, "PNG", 20, 15, 38, 25);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...COLORS.ink);
  doc.text("TERMS AND CONDITIONS", 72, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.muted);
  doc.text("Private aviation service agreement", 72, 32);
  drawVerticalBrand(doc, "RED SKY GROUP TERMS");

  addSectionText(
    doc,
    termsState,
    "USE OF PRIVATE AVIATION SERVICE",
    "The use of the aircraft is strictly limited to private transportation purposes, including family, business, and leisure travel. Any commercial or cargo activities of any kind are expressly prohibited.",
  );

  addSectionText(
    doc,
    termsState,
    "INCLUDED SERVICES",
    "The private jet includes airport fees, fuel, crew fees, a premium minibar, and snacks. This service must be requested in advance by the passenger to ensure proper delivery.",
  );

  addSectionText(
    doc,
    termsState,
    "CAPACITY AND LUGGAGE",
    `The maximum capacity of the aircraft is ${pax} passengers. Each passenger is permitted one (1) 50-pound bag and one (1) small handbag.`,
  );

  addSectionText(
    doc,
    termsState,
    "PAYMENT AND DEPOSIT",
    "The passenger must pay Red Sky Group a deposit of 50% of the total trip cost to secure the private aviation service. The remaining balance must be paid in full prior to boarding.",
  );

  addSectionText(
    doc,
    termsState,
    "ADDITIONAL DEPOSIT",
    "Depending on the destination, Red Sky Group may require a deposit greater than 50% to cover trip expenses such as fuel, handling, and overflight permits.",
  );

  addSectionText(
    doc,
    termsState,
    "PASSENGER AND COMPANIONS RESPONSIBILITY",
    "The passenger agrees to use and fly in the aircraft at their own risk and responsibility, as do their companions. The passenger and their companions confirm that they have medical insurance and will be responsible for any hospital expenses in the event of an accident at the airport ramp or FBO facilities.",
  );

  addSectionText(
    doc,
    termsState,
    "COMPLIANCE WITH SAFETY INSTRUCTIONS",
    "Passengers must comply at all times with all instructions and safety measures indicated by the Captain or First Officer. If crew instructions are not followed, Red Sky Group shall not be liable for any accidents occurring onboard the aircraft or airport facilities.",
  );

  addSectionText(
    doc,
    termsState,
    "PROHIBITIONS ONBOARD THE AIRCRAFT",
    "- Throwing sanitary paper or towels into the toilet.\n- Standing while the aircraft is taxiing, taking off, landing, or during turbulence.\n- Improper use of electronic or entertainment equipment.\n- Excessive alcohol consumption.\n- Possession or use of weapons, drugs, or illegal substances.",
  );

  addSectionText(
    doc,
    termsState,
    "TRANSPORT OF PROHIBITED ITEMS",
    "Transporting illegal substances, explosives, firearms, ammunition, or any items prohibited under the laws of Mexico or the United States is strictly forbidden. Transporting cash amounts exceeding legal limits without declaration is prohibited. In Mexico, the maximum amount without declaration is $10,000 USD.",
  );

  addSectionText(
    doc,
    termsState,
    "DAMAGES AND ADDITIONAL COSTS",
    "- Damage to aircraft electronic or entertainment equipment.\n- Burns or irreparable stains on seats, flooring or carpets.\n- Malfunction of aircraft toilet due to improper use.\n- Loss or damage to onboard furniture or amenities.",
  );

  addSectionText(
    doc,
    termsState,
    "CANCELLATION POLICIES",
    "To cancel the private aviation service, the passenger must notify Red Sky Group at least 48 hours before the scheduled departure. Cancellations made less than 48 hours before departure will incur a charge of $3,300 USD plus tax. Cancellation requests must be submitted in writing to ventas@redskyg.com.",
  );

  addSectionText(
    doc,
    termsState,
    "DISCLAIMER OF LIABILITY",
    "Red Sky Group shall not be liable for illegal actions committed by the passenger or their companions. Passengers agree to indemnify and hold harmless Red Sky Group and its personnel from any legal claims resulting from such actions.",
  );

  addSectionText(
    doc,
    termsState,
    "COMPLIANCE WITH REGULATIONS",
    "Red Sky Group operates in strict compliance with aviation regulations in Mexico and the United States. Responsibility for compliance with laws related to transported goods or cash rests solely with the passenger.",
  );

  addSectionText(
    doc,
    termsState,
    "REFUSAL OF SERVICE",
    "Red Sky Group reserves the right to refuse boarding or terminate services if illegal activity is suspected. No refund will be provided in such cases.",
  );

  addSectionText(
    doc,
    termsState,
    "ACCEPTANCE OF TERMS AND CONDITIONS",
    "By booking and using the private jet of Red Sky Group, the passenger and their companions acknowledge and agree to comply with all terms and conditions set forth in this document.",
  );

  addPageFooter(doc);
  return doc.output("blob");
};
