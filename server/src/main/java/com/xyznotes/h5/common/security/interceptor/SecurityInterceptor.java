package com.xyznotes.h5.common.security.interceptor;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.JWTVerifyException;
import com.xyznotes.h5.common.exception.AppException;
import com.xyznotes.h5.user.model.UserToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by sunlong on 15/11/28.
 */
public class SecurityInterceptor extends HandlerInterceptorAdapter {
    private long expire = 12 * 60 * 60 * 1000;
    private String loginUrl = "/login.html";
    private String tokenName = "access_token";
    private JWTVerifier verifier = new JWTVerifier("odfa0618");
    private static Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException, ServletException {
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            return true;
        }

        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        String authorization = request.getHeader("Authorization");
        if (authorization == null) {
            authorization = request.getParameter(tokenName);
        }
        if (authorization != null && authorization.startsWith("Bearer ")) {
            authorization = authorization.substring("Bearer ".length());
        }

        Auth auth = ((HandlerMethod) handler).getMethod().getAnnotation(Auth.class);
        if (auth == null) {
            auth = ((HandlerMethod) handler).getBeanType().getAnnotation(Auth.class);
        }

        if (auth != null) {
            String rules = auth.value();
            if (!Objects.equals(rules.trim(), "anon")) {
                boolean ajax = true;
//                boolean ajax = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
                if (authorization == null) {
                    writeInvalid(response, 403);
                    return false;
                }
                try {
                    Map<String, Object> claims = verifier.verify(authorization);
                    UserToken userToken = new UserToken(
                            (Integer) claims.get("id"),
                            (Integer) claims.get("role"),
                            (String) claims.get("avatar"),
                            (String) claims.get("name"),
                            (Long) claims.get("datetime")
                    );

                    if (validate(auth, userToken)) {
                        request.setAttribute("userid", userToken);
                        return true;
                    } else {
                        writeInvalid(response, 403);
                        return false;
                    }
                } catch (NoSuchAlgorithmException | JWTVerifyException | InvalidKeyException e) {
                    writeInvalid(ajax, response, "登录验证失败, 请反馈给管理员!");
                    return false;
                } catch (SignatureException e) {
                    writeInvalid(ajax, response, "登录验证失败!");
                    return false;
                } catch (AppException e) {
                    writeInvalid(ajax, response, "登录已过期,请重新登录!");
                    return false;
                } catch (IllegalStateException e) {
                    writeInvalid(ajax, response, "access_token不正确，请退出后重试");
                    return false;
                }
            }
        }

        return true;
    }

    private void writeInvalid(boolean ajax, HttpServletResponse response, String msg) throws IOException {
        if (ajax) {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json");
            response.addHeader("Access-Control-Allow-Origin","*");
            response.addHeader("Access-Control-Allow-Methods","*");
            response.addHeader("Access-Control-Allow-Headers","*");
            response.getWriter().write("{\"success\": false, \"msg\":\"" + msg + "\"}");
            response.getWriter().close();
        } else {
            response.sendRedirect(loginUrl + "?msg=" + URLEncoder.encode(msg, "UTF-8"));
        }

    }

    private void writeInvalid(HttpServletResponse response, Integer status) throws IOException {
        response.sendError(status);
    }

    private boolean validate(Auth auth, UserToken userToken) throws AppException {
        long datetime = userToken.getDatetime();
        checkExpire(datetime);

        String rules = auth.value();
        if (rules.equals("")) {
            return true;
        }

        if (auth.type() == AuthType.ROLE) {
            for (String roleName : rules.split(",")) {
                if (roleName.trim().equals(userToken.getRole())) {
                    return true;
                }
            }
            return false;
        } else if (auth.type() == AuthType.PERMISSION) {
            List<String> permissions = userToken.getPermissions();
            if (permissions != null) {
                for (String str : permissions) {
                    if (str.equals(rules.trim())) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            logger.error("error to config validation rule, pls check your spring xml files");
            return false;
        }
    }

    private void checkExpire(Long datetime) throws AppException {
        if (datetime == null) {
            throw new AppException();
        } else if (Calendar.getInstance().getTimeInMillis() - datetime > expire) {
            throw new AppException();
        }
    }

    public void setTokenName(String tokenName) {
        this.tokenName = tokenName;
    }

    public void setLoginUrl(String loginUrl) {
        this.loginUrl = loginUrl;
    }

    public void setExpire(long expire) {
        this.expire = expire;
    }
}
