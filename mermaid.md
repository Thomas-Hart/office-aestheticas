flowchart TD
  %% Payment Layer
  subgraph PaymentLayer
    A[Customer Initiates Payment]
    B[Payment Gateway: PayPal, Stripe, etc.]
    A --> B
    B --> C[Payment Confirmation]
  end

  %% Order Processing
  subgraph OrderProcessing
    C --> D[Order Service]
    D --> E[Create Normalized Order Record]
    E --> F[Emit Order Event]
  end

  %% Communication Layer
  subgraph CommunicationLayer
    F -.-> M[Event Bus / Message Queue]
    M -.-> G[Fulfillment Adapter Router]
  end

  %% Fulfillment Layer
  subgraph FulfillmentLayer
    G --> H1[Manual Fulfillment Adapter]
    G --> H2[3PL Fulfillment Adapter]
    G --> H3[Dropshipping Adapter]
  end

  %% External Systems and Feedback
  subgraph ExternalSystems
    H1 --> I[Admin Dashboard & Manual Processing]
    H2 --> J[3PL API Integration]
    H3 --> K[Dropshipping API / CSV Generator]
  end

  %% Feedback Loop
  subgraph FeedbackLoop
    J --> L[Webhook / API Updates]
    K --> L
    I --> L
    L --> D
  end

  %% Optional: Direct Order API Communication
  F --> N[Order API Endpoint]
  N --> D
