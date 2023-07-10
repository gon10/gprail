export const getAppInfoHeaders = () => {
  const appId = localStorage.getItem("appId");
  const appName = localStorage.getItem("appName");

  return {
    appId,
    appName,
  };
};
