import rateLimit from "express-rate-limit"

export const verifyRateLimit = rateLimit({
    windowMs:  15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
	ipv6Subnet: 56,
})

export const loginRateLimit = rateLimit({
    windowMs:  15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
	ipv6Subnet: 56,
})

export const logoutRateLimit = rateLimit({
    windowMs:  15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
	ipv6Subnet: 56,
})

export const contestFetchRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 60, 
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});