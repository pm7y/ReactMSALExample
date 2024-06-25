# Steps

Register a new app in Entra Id
https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration

Scaffold a new React/Typescript app.
https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts

```
npm create vite@latest react-msal -- --template react-swc-ts

cd react-msal
npm install
npm run dev
```

Install the MSAL React package.

```
npm install @azure/msal-react @azure/msal-browser
```

https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-react-samples/typescript-sample/README.md

## Setup Entra Id App Registration

To run the app you will need an Azure subscription so that you can create an Entra Id App Registration. You can either do that manually in the Azure portal or by using the Azure CLI and the following steps.

1. Install Azure CLI (if you haven't already): Follow the installation instructions for your operating system from the [official Azure CLI documentation](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

2. Sign in to Azure

```
az login --tenant "your-tenant-id"
```

3. Create the app registration and note the "appId" (client Id) and "id" (object id) that is output in the json:

```
az ad app create --display-name "YourAppName" --sign-in-audience "AzureADMultipleOrgs"
```

4. Add a SPA redirect URI, replace <your-app-object-id> in the following command with the "id" from step 3:

```
az rest --method PATCH --uri 'https://graph.microsoft.com/v1.0/applications/<your-app-object-id>' --headers 'Content-Type=application/json' --body {"spa":{"redirectUris":["http://localhost:5173/"]}}'
```

5. Add Microsoft Graph API permissions, replace your-app-client-id in the following command with the "appId" from step 3:

```
az ad app permission add --id "your-app-client-id" --api 00000003-0000-0000-c000-000000000000 --api-permissions 311a71cc-e848-46a1-bdf8-97ff7156d8e6=Scope
```

6. Edit authConfig.ts and replace the clientId with the "appId" from step 3. You should now be able to run the app and login.
