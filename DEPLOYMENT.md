# Deployment Guide: AWS App Runner + RDS (Enterprise Secure)

This guide outlines how to deploy your Next.js application using **AWS App Runner** (Manual Configuration) and **AWS RDS**.

## Prerequisites
- An AWS Account.
- A GitHub repository with your code pushed.

---

## Step 1: Provision Infrastructure (Automated)

We will use CloudFormation to create a secure VPC, a private RDS PostgreSQL database, and a **VPC Connector**.

> **Note**: If you have already updated the stack to include the VPC Connector, you can skip this step.

1.  **Log in to AWS Console** and search for **CloudFormation**.
2.  Click **Create stack** -> **With new resources (standard)**.
3.  **Template source**: Upload a template file.
4.  Upload the `cloudformation.yaml` file from this project.
5.  **Specify stack details**:
    -   **Stack name**: `review-portal-infra`.
    -   **DbUsername**: `postgres`.
    -   **DbPassword**: Enter a strong password.
    -   **EnvironmentName**: `dev`.
6.  Click **Next** through the options and **Submit**.
7.  **Wait** for the stack status to reach `CREATE_COMPLETE`.
8.  Go to the **Outputs** tab and note down:
    -   `DBEndpoint`
    -   `VpcConnectorArn`

---

## Step 2: Deploy the Application (AWS App Runner)

1.  Search for **AWS App Runner** in the AWS Console.
2.  Click **Create an App Runner service**.
3.  **Source**:
    -   **Repository type**: Source code repository.
    -   **Provider**: GitHub.
    -   **Repository**: Select your repo and branch.
    -   **Deployment settings**: Automatic (recommended).
4.  **Configure build**:
    -   **Configuration file**: Select **Configure all settings here**.
    -   **Runtime**: Node.js 20.
    -   **Build command**:
        ```bash
        npm run build:apprunner
        ```
    -   **Start command**:
        ```bash
        npm run start:apprunner
        ```
    -   **Port**: `3000`.
5.  Click **Next**.

---

## Step 3: Configure Service Settings

1.  **Service name**: `review-portal-app`.
2.  **Environment variables** (Add these):
    -   `DATABASE_URL`: `postgresql://<DbUsername>:<DbPassword>@<DBEndpoint>:5432/postgres`
    -   `NEXTAUTH_SECRET`: Generate a random string.
    -   `NEXTAUTH_URL`: Leave blank for now.
3.  **Networking** (Crucial Step):
    -   **Incoming network traffic**: Public endpoint.
    -   **Outgoing network traffic**: Select **Custom VPC**.
    -   **VPC Connector**: Select the connector created by CloudFormation (`...-review-portal-connector`).
4.  Click **Next** and then **Create & deploy**.

---

## Step 4: Finalize Configuration

1.  Wait for the service to reach **Running** status.
2.  Copy the **Default domain** URL.
3.  Go to the **Configuration** tab -> **Environment variables**.
4.  Update `NEXTAUTH_URL` to your new App Runner domain.
5.  Click **Save changes**.

---

## Troubleshooting

### Deployment Failed (after successful build)
If the build succeeds but deployment fails, it means the application failed to start. This is usually due to **Database Connectivity**.

1.  **Check Application Logs**:
    -   Go to your App Runner service dashboard.
    -   Click the **Logs** tab (usually between "Metrics" and "Configuration").
    -   In the "Log groups" section, you will see **Event logs** and **Deployment logs**.
    -   **Crucial**: Look for a section called **Application logs** or **Service logs**. You might need to click a link that says "View in CloudWatch" if the console view is truncated.
    -   If you see `Error: P1001: Can't reach database server`, it means the App Runner service cannot connect to RDS.

2.  **Verify VPC Connector**:
    -   Go to **Configuration** tab -> **Networking**.
    -   Ensure **Outgoing network traffic** is set to **Custom VPC**.
    -   Ensure the **VPC Connector** is selected.

3.  **Verify Environment Variables**:
    -   Go to **Configuration** tab -> **Environment variables**.
    -   Check `DATABASE_URL`. It should look like: `postgresql://postgres:PASSWORD@...us-east-1.rds.amazonaws.com:5432/postgres`
    -   Ensure there are no spaces or typos.

### Deployment Hanging (Health Check Timeout)
If the deployment sits at "Performing health check" for 10+ minutes and then fails:
1.  **Cause**: The application is running but not accessible by App Runner. This usually means it's listening on `localhost` (127.0.0.1) instead of `0.0.0.0`.
2.  **Fix**: Ensure your start command includes `HOSTNAME=0.0.0.0`.
    -   Example: `HOSTNAME=0.0.0.0 node .next/standalone/server.js`
3.  **Aborting**: You cannot manually abort a deployment in this phase. You must wait for it to time out (fail), which takes about 15 minutes.
