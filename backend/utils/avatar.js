const DEFAULT_AVATAR_TEMPLATE =
  "https://avatar.iran.liara.run/public/{{genderPath}}?username={{username}}";

const sanitizeTemplate = (template) => template.replace(/\s+/g, " ").trim();

const getTemplate = () => {
  const customTemplate = process.env.AVATAR_TEMPLATE_URL;
  if (customTemplate && customTemplate.trim().length > 0) {
    return sanitizeTemplate(customTemplate);
  }
  return DEFAULT_AVATAR_TEMPLATE;
};

const replaceToken = (template, token, value) =>
  template.replace(new RegExp(`{{\\s*${token}\\s*}}`, "g"), value);

export const buildAvatarUrl = (username, gender) => {
  const template = getTemplate();
  const genderPath = gender === "female" ? "girl" : "boy";

  return replaceToken(
    replaceToken(
      replaceToken(template, "username", encodeURIComponent(username)),
      "genderPath",
      genderPath,
    ),
    "gender",
    gender,
  );
};

export const ensureAvatarUrl = (user) => {
  if (user.profilePic && user.profilePic.trim().length > 0) {
    return user.profilePic;
  }
  return buildAvatarUrl(user.username, user.gender);
};
