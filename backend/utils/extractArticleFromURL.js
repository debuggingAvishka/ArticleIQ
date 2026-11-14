
const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("node:dns").promises;
const http = require("node:http");
const https = require("node:https");
const ipaddr = require("ipaddr.js");

async function extractArticleFromURL(url) {
  try {
    const parsedURL = new URL(url);

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are allowed");
    }

    const hostname = parsedURL.hostname.replace(/^\[|\]$/g, "");

    // Resolve the hostname before making the request.
    const addresses = await dns.lookup(hostname, {
      all: true,
      verbatim: true,
    });

    if (!addresses.length) {
      throw new Error("Could not resolve hostname");
    }

    // Reject private, loopback, link-local and other non-public IP ranges.
    for (const entry of addresses) {
      const address = ipaddr.process(entry.address);

      if (address.range() !== "unicast") {
        throw new Error("Requests to non-public IP addresses are not allowed");
      }
    }

    // Use the validated DNS results for the actual connection too.
    const lookup = (host, options, callback) => {
      if (options && options.all) {
        return callback(null, addresses);
      }

      return callback(
        null,
        addresses[0].address,
        addresses[0].family
      );
    };

    const { data } = await axios.get(parsedURL.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
      },
      timeout: 10000,
      maxRedirects: 0,
      maxContentLength: 2 * 1024 * 1024,
      httpAgent: new http.Agent({ lookup }),
      httpsAgent: new https.Agent({ lookup }),
    });

    const $ = cheerio.load(data);

    const text = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join(" ");

    const cleanedText = text.replace(/\s+/g, " ").trim();

    if (!cleanedText || cleanedText.length < 100) {
      throw new Error("Could not extract enough article text");
    }

    return cleanedText;
  } catch (error) {
    console.error("URL Extraction Error:", error.message);
    throw new Error("Failed to extract article from URL");
  }
}

module.exports = { extractArticleFromURL };
