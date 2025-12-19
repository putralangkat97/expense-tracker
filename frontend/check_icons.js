import * as icons from "lucide-vue-next";

const requiredIcons = [
  "Wallet",
  "Mail",
  "Lock",
  "Eye",
  "EyeOff",
  "Fingerprint",
];
const missingIcons = requiredIcons.filter((icon) => !icons[icon]);

if (missingIcons.length > 0) {
  console.log("Missing icons:", missingIcons);
  process.exit(1);
} else {
  console.log("All icons found");
}
