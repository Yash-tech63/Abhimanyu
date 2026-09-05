const KEYS = {
  CART_COUNT: 'pulseplus_cart_count',
  CART_ITEMS: 'pulseplus_cart_items',
  RECORDS: 'pulseplus_health_records',
  STUDIO_PROJECTS: 'pulseplus_studio_projects',
  USER_SESSION: 'pulseplus_user_session',
  APPOINTMENTS: 'pulseplus_appointments'
};

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
    localStorage.removeItem(KEYS.USER_SESSION);
  },
  login: (id) => {
    localStorage.setItem(KEYS.USER_SESSION, JSON.stringify({ id, timestamp: Date.now() }));
  },
  isLoggedIn: () => !!localStorage.getItem(KEYS.USER_SESSION)
};
