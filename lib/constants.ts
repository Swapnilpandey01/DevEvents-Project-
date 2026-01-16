export type EventItem = {
image: string;
title: string;
slug: string;
location: string;
date: string; // e.g., "2025-11-07"
time: string; // e.g., "09:00 AM"
};

export const events: EventItem[] = [
  {
    title: "React Conf 2026",
    image: "/images/event1.png",
    slug: "react-conf-2026",
    location: "Las Vegas, NV",
    date: "March 15, 2026",
    time: "9:00 AM - 6:00 PM"
  },
  {
    title: "Google I/O 2026",
    image: "/images/event2.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "May 20, 2026",
    time: "10:00 AM - 5:00 PM"
  },
  {
    title: "PyCon US 2026",
    image: "/images/event3.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, PA",
    date: "April 22, 2026",
    time: "8:00 AM - 7:00 PM"
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event4.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "June 10, 2026",
    time: "9:30 AM - 6:30 PM"
  },
  {
    title: "Major League Hacking Hackathon",
    image: "/images/event5.png",
    slug: "mlh-hackathon-2026",
    location: "San Francisco, CA",
    date: "February 28, 2026",
    time: "12:00 PM - 12:00 PM (24h)"
  },
  {
    title: "TechCrunch Disrupt 2026",
    image: "/images/event6.png",
    slug: "techcrunch-disrupt-2026",
    location: "San Francisco, CA",
    date: "October 5, 2026",
    time: "9:00 AM - 6:00 PM"
  }
];