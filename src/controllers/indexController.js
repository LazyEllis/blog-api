export const sendCatchAllMessage = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};
