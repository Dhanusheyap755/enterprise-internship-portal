const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
const courses = new Set([
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "AI/ML"
]);

const clean = (v) => typeof v === "string" ? v.trim() : "";

export function validateApplication(input = {}) {
  const data = {
    name: clean(input.name),
    email: clean(input.email).toLowerCase(),
    phone: clean(input.phone),
    course: clean(input.course),
    message: clean(input.message)
  };
  const errors = {};

  if (data.name.length < 2 || data.name.length > 80)
    errors.name = "Name must be 2–80 characters.";
  if (data.email.length > 120 || !emailRegex.test(data.email))
    errors.email = "Enter a valid email address.";
  if (!phoneRegex.test(data.phone))
    errors.phone = "Enter a valid phone number.";
  if (!courses.has(data.course))
    errors.course = "Select a valid course.";
  if (data.message.length < 10 || data.message.length > 1000)
    errors.message = "Message must be 10–1000 characters.";

  return { valid: Object.keys(errors).length === 0, data, errors };
}
