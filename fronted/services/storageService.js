const KEYS = {
  CART_COUNT: 'abhimanyu_cart_count',
  CART_ITEMS: 'abhimanyu_cart_items',
  RECORDS: 'abhimanyu_health_records',
  STUDIO_PROJECTS: 'abhimanyu_studio_projects',
  USER_SESSION: 'abhimanyu_user_session',
  APPOINTMENTS: 'abhimanyu_appointments'
};

const AUTH_KEYS = [
  'token',
  'authToken',
  'accessToken',
  'jwtToken',
  'user',
  'currentUser',
  KEYS.USER_SESSION
];

export const storage = {
  getCartCount: () => Number(localStorage.getItem(KEYS.CART_COUNT)) || 0,
  setCartCount: (count) => localStorage.setItem(KEYS.CART_COUNT, count.toString()),

  getCartItems: () => {
    try {
      const data = localStorage.getItem(KEYS.CART_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  setCartItems: (items) => {
    localStorage.setItem(KEYS.CART_ITEMS, JSON.stringify(items));
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    localStorage.setItem(KEYS.CART_COUNT, totalCount.toString());
  },

  getStudioProjects: () => {
    const data = localStorage.getItem(KEYS.STUDIO_PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  saveStudioProject: (project) => {
    const projects = storage.getStudioProjects();
    localStorage.setItem(KEYS.STUDIO_PROJECTS, JSON.stringify([project, ...projects]));
  },

  getAppointments: () => {
    const data = localStorage.getItem(KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  },
  saveAppointment: (appointment) => {
    const appointments = storage.getAppointments();
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify([appointment, ...appointments]));
  },

  logout: () => {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  },
  login: (id) => {
    localStorage.setItem(KEYS.USER_SESSION, JSON.stringify({ id, timestamp: Date.now() }));
  },
  isLoggedIn: () => AUTH_KEYS.some((key) => Boolean(localStorage.getItem(key)))
};
