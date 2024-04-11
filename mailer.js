const nodeMailer = require('nodemailer');



const sendMail = async (email, option = {}) => {

  const html = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

    <style type="text/css">
      @media only screen and (min-width: 520px) {
  .u-row {
    width: 500px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-33p33 {
    width: 166.65px !important;
  }

  .u-row .u-col-100 {
    width: 500px !important;
  }

}

@media (max-width: 520px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } </style>



<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F7F8F9;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F7F8F9;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #F7F8F9;"><![endif]-->



<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">

    <svg width="125" height="41" viewBox="0 0 125 41" fill="none" xmlns="http://www.w3.org/2000/svg" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 146.67px;" width="146.67"">
        <path d="M13.7731 13.8375H4.51389V10.3069H12.5579V7.00417H4.51389V3.5875H13.6574V0.284722H0.752315V17.0833H13.7731V13.8375ZM53.4722 9.79445V0.284722H49.7107V9.90833C49.7107 12.5847 48.3218 13.9514 46.007 13.9514C43.6921 13.9514 42.3032 12.5278 42.3032 9.79445V0.284722H38.5417V9.90833C38.5417 14.8625 41.3773 17.3681 45.9491 17.3681C50.5787 17.3681 53.4722 14.8625 53.4722 9.79445ZM62.3843 0.170833L55.0347 17.0833H58.8542L60.4167 13.325H67.6505L69.213 17.0833H73.1481L65.8565 0.170833H62.3843ZM61.8056 10.0792L64.0625 4.6125L66.3194 10.0792H61.8056ZM78.0093 17.0833H81.7708V3.70139H86.9792V0.284722H72.8009V3.70139H78.0093V17.0833ZM106.655 8.7125C106.655 3.87222 102.894 0 97.5695 0C92.3032 0 88.4838 3.92917 88.4838 8.7125V8.76944C88.4838 13.5528 92.2454 17.425 97.5695 17.425C102.836 17.3681 106.655 13.4958 106.655 8.7125ZM92.419 8.7125C92.419 5.80833 94.5023 3.41667 97.5695 3.41667C100.579 3.41667 102.72 5.80833 102.72 8.7125V8.76944C102.72 11.6736 100.637 14.0083 97.5695 14.0083C94.5602 14.0083 92.419 11.5597 92.419 8.7125ZM114.005 11.7306H116.956L120.602 17.1403H125L120.833 11.1611C123.032 10.3639 124.479 8.65555 124.479 5.92222V5.86528C124.479 4.27083 123.958 2.96111 123.032 2.05C121.933 0.968055 120.197 0.341667 118.056 0.341667H110.243V17.0833H114.005V11.7306ZM114.005 3.64444H117.766C119.618 3.64444 120.718 4.44167 120.718 6.03611V6.09306C120.718 7.51667 119.676 8.48472 117.824 8.48472H114.005V3.64444ZM25.8102 17.3681C27.7778 17.3681 29.5139 16.7986 30.9606 15.8875L31.7708 17.0833H36.169L33.5648 13.3819C34.4329 12.0153 34.9537 10.4208 34.9537 8.7125V8.65555C34.9537 3.87222 31.1343 0 25.8681 0C20.6019 0 16.7824 3.92917 16.7824 8.7125V8.76944C16.7824 13.5528 20.544 17.3681 25.8102 17.3681ZM20.7176 8.65555C20.7176 5.75139 22.8009 3.41667 25.8681 3.41667C28.8773 3.41667 31.0185 5.80833 31.0185 8.7125V8.76944C31.0185 9.11111 30.9606 9.39583 30.9606 9.68056H26.7361L28.9931 12.9833C28.1829 13.6097 27.0833 14.0083 25.9259 14.0083C22.8588 14.0083 20.7176 11.5597 20.7176 8.65555ZM8.91204 37.5833C5.96065 37.5833 3.93519 35.1917 3.93519 32.2875V32.2306C3.93519 29.3264 6.01852 26.9917 8.91204 26.9917C10.6481 26.9917 11.9792 27.7319 13.3102 28.8708L15.625 26.1944C14.0625 24.6569 12.0949 23.575 8.91204 23.575C3.64583 23.6319 0 27.5042 0 32.2875V32.3444C0 37.1847 3.76157 41 8.73843 41C12.037 41 14.0046 39.8611 15.7407 37.9819L13.3681 35.5903C12.037 36.8431 10.8218 37.5833 8.91204 37.5833ZM27.7778 23.6319C22.5116 23.6319 18.6921 27.5611 18.6921 32.3444V32.4014C18.6921 37.1278 22.4537 41 27.7778 41C33.044 41 36.8634 37.0708 36.8634 32.2875V32.2306C36.8634 27.4472 33.1019 23.6319 27.7778 23.6319ZM32.9282 32.3444C32.9282 35.2486 30.8449 37.5833 27.7778 37.5833C24.7106 37.5833 22.6273 35.1917 22.6273 32.2875V32.2306C22.6273 29.3264 24.7106 26.9917 27.7778 26.9917C30.787 26.9917 32.9282 29.4403 32.9282 32.3444ZM40.7986 40.7153H44.5602V34.2236H52.7199V30.8639H44.5602V27.2764H53.8194V23.9167H40.7986V40.7153ZM58.6227 40.7153H62.3843V34.2236H70.544V30.8639H62.3843V27.2764H71.6435V23.9167H58.6227V40.7153ZM79.919 33.8819H87.963V30.5792H79.919V27.1625H89.0625V23.9167H76.1574V40.7153H89.1782V37.4125H79.919V33.8819ZM97.8588 33.8819H105.903V30.5792H97.8588V27.1625H107.002V23.9167H94.0972V40.7153H107.118V37.4125H97.8588V33.8819ZM119.213 30.6361C116.262 29.8958 115.509 29.5542 115.509 28.4153V28.3583C115.509 27.5611 116.262 26.8778 117.708 26.8778C119.155 26.8778 120.66 27.5042 122.164 28.5292L124.132 25.7389C122.396 24.3722 120.255 23.575 117.766 23.575C114.294 23.575 111.806 25.5681 111.806 28.6431V28.7C111.806 32.0597 114.005 32.9708 117.477 33.825C120.312 34.5653 120.891 35.0208 120.891 35.9889V36.0458C120.891 37.0139 119.965 37.6403 118.403 37.6403C116.435 37.6403 114.815 36.8431 113.31 35.5903L111.111 38.2097C113.137 40.0319 115.799 40.8861 118.345 40.8861C122.049 40.8861 124.595 39.0069 124.595 35.6472V35.5903C124.595 32.7431 122.685 31.5472 119.213 30.6361Z" fill="#ED1C24"/>
    </svg>


    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>





<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 400;"><span><span><span><span><span><span><span><span>Click here to reset your password:</span></span></span></span></span></span></span></span></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>





<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <div>
    <h2 style="text-align: center; padding: 12px; background: #d9d9d9">
      <a href="http://127.0.0.1:3000/forgot-password${option?.link}">Click here!</a>
    </h2>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>





<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="line-height: 140%;">This is our reset password link, you can click it to verify. If it secure, we will let you create your own new password</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="line-height: 140%;">Thank you for using our website! Hope you enjoy yourself</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>



    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>

`;
  
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hohoanggiang80@gmail.com',
            pass: 'laka rcey etic yied'
        }
    })

    const mailOptions = {
        from: 'Equator Coffee <hohoanggiang80@gmail.com>',
        to: email,
      subject: `Your reset password link is here:`,
        html: html
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: ' + info.messageId);

    return info;
}

module.exports = sendMail;

// <img align="center" border="0" src="/assets/image/logo.svg" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 146.67px;" width="146.67"/>