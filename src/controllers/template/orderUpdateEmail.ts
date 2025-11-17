import secrets from '../../secrets.js';

const orderUpdateEmail = (content: any) => {
  return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Thank You for Your Order!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }

                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }

                    th,
                    td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }

                    th {
                        background-color: #f4f4f4;
                    }

                    h1 {
                        color: #333;
                    }

                    p {
                        margin: 0 0 20px;
                    }

                    .footer {
                        font-size: 0.9em;
                        color: #777;
                        text-align: center;
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <h1>Thank You for Your Order!</h1>
                    <p>Dear ${content.userName},</p>
                    <p>Thank you for your order! We appreciate your business and are excited to get your items to you.</p>

                    <h2>You Order Status has been updated to ${content.status}, for query contact us.</h2>

                    <p>Thank you again for choosing us!</p>

                    <div class="footer">
                        Best regards,<br>
                        ${secrets.COMPANY_NAME}<br>
                        ${secrets.COMPANY_ADDRESS}<br>
                        ${secrets.COMPANY_SLOGAN}<br>
                    </div>
                </div>
            </body>

            </html>`;
};

export default orderUpdateEmail;
