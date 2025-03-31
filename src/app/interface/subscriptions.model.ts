export interface Subscriptions {
    company_id: number
    tier_id: number
    transaction_code: String
    status: String
    created_at: String
    id: number
}

export interface Subscription {
    tier_id: number
    transaction_code: String
    status: String
}

export interface Subscribe {
    company_id: number
    tier_id: number
    // transaction_code: String
}

export interface UpdateSubscription {
    // subscription_id: number
    tier_id: number
    transaction_code: String
    status: String
}

export interface CancelSubscription {
    status: String,
}