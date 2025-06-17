export const saveToLocal = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const loadFromLocal = () => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
};
