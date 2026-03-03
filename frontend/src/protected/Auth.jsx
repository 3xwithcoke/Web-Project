import { jwtDecode } from "jwt-decode";
 
export const getToken = () => localStorage.getItem("token");
// export const getUserDetails = () => {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

export const logout = () => {
  localStorage.removeItem("token");
};
export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return true;
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (e) {
        return true;
    }
};

export const getDecodedToken = () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      return null;
    }

    try {
      return jwtDecode(token);
    } catch (e) {
      localStorage.removeItem("token");
      return null;
    }
};

export const getUserRole = () => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (e) {
        localStorage.removeItem("token");
        return null;
    }
};

export const getUser = () => {
    const localUser = localStorage.getItem("user");
  if (localUser) {
    try {
      return JSON.parse(localUser);
    } catch (e) {
      localStorage.removeItem("user"); 
    }
  }
    const decoded = getDecodedToken();
    if (!decoded) return null;

    return {
      id: decoded.user_id,
      name: decoded.username,
      email: decoded.email,
      profilePicture : decoded.profilePicture || "",
    };
};

export const updateToken = (newToken) => {
    localStorage.setItem("token", newToken);
    window.dispatchEvent(new Event("userUpdated"));
};