/**
 * ============================================================
 * Little Leap AQL — Authentication & API Logic
 * ============================================================
 */

// Shared constants are located in Constants.gs


function doPost(e) {
  const result = { success: false, message: 'Invalid request' };
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'login') {
      return response(handleLogin(data.email, data.password));
    }

    // All other actions require a token
    const user = validateToken(data.token);
    if (!user) {
      return response({ success: false, message: 'Unauthorized' });
    }

    switch (action) {
      case 'getProfile':
        return response(handleGetProfile(user));
      case 'updateAvatar':
        return response(handleUpdateAvatar(user.UserID, data.avatarUrl));
      default:
        result.message = 'Action not found';
    }
  } catch (err) {
    result.message = err.toString();
  }
  return response(result);
}

/**
 * Helper to return JSON response
 */
function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle Login
 */
function handleLogin(email, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const emailIdx = headers.indexOf('Email');
  const passIdx = headers.indexOf('PasswordHash');
  const statusIdx = headers.indexOf('Status');
  const apiKeyIdx = headers.indexOf('ApiKey');
  const avatarIdx = headers.indexOf('Avatar');
  const idIdx = headers.indexOf('UserID');
  const nameIdx = headers.indexOf('Name');

  const passwordHash = hashPassword(password);

  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIdx] === email && data[i][passIdx] === passwordHash) {
      if (data[i][statusIdx] !== 'Active') {
        return { success: false, message: 'Account is inactive' };
      }
      
      const token = Utilities.getUuid();
      sheet.getRange(i + 1, apiKeyIdx + 1).setValue(token);
      
      return { 
        success: true, 
        token: token,
        user: {
          id: data[i][idIdx],
          name: data[i][nameIdx],
          email: data[i][emailIdx],
          avatar: data[i][avatarIdx] || '',
          role: getUserRole(data[i][idIdx])
        }
      };
    }
  }
  return { success: false, message: 'Invalid credentials' };
}

/**
 * Stateless Validation
 */
function validateToken(token) {
  if (!token) return null;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const apiKeyIdx = headers.indexOf('ApiKey');

  for (let i = 1; i < data.length; i++) {
    if (data[i][apiKeyIdx] === token) {
      const user = {};
      headers.forEach((h, idx) => user[h] = data[i][idx]);
      return user;
    }
  }
  return null;
}

/**
 * Get Profile Info
 */
function handleGetProfile(user) {
  return {
    success: true,
    user: {
      id: user.UserID,
      name: user.Name,
      email: user.Email,
      avatar: user.Avatar || '',
      role: getUserRole(user.UserID)
    }
  };
}

/**
 * Update Avatar Link
 */
function handleUpdateAvatar(userId, avatarUrl) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('UserID');
  const avatarIdx = headers.indexOf('Avatar');

  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === userId) {
      sheet.getRange(i + 1, avatarIdx + 1).setValue(avatarUrl);
      return { success: true, avatarUrl: avatarUrl };
    }
  }
  return { success: false, message: 'User not found' };
}

/**
 * Helper to fetch roles
 */
function getUserRole(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
  const roleSheet = ss.getSheetByName(CONFIG.SHEETS.ROLES);

  if (!userSheet || !roleSheet) return 'User';

  // 1. Get RoleID from Users sheet
  const userData = userSheet.getDataRange().getValues();
  const userHeaders = userData[0];
  const idIdx = userHeaders.indexOf('UserID');
  const roleIdIdx = userHeaders.indexOf('RoleID');

  let roleId = null;
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][idIdx] === userId) {
      roleId = userData[i][roleIdIdx];
      break;
    }
  }

  if (!roleId) return 'User';

  // 2. Get Role Name from Roles sheet
  const roleData = roleSheet.getDataRange().getValues();
  const roleHeaders = roleData[0];
  const rIdIdx = roleHeaders.indexOf('RoleID');
  const rNameIdx = roleHeaders.indexOf('Name');

  for (let i = 1; i < roleData.length; i++) {
    if (roleData[i][rIdIdx] === roleId) {
      return roleData[i][rNameIdx];
    }
  }

  return 'User';
}

/**
 * SHA-256 Hashing
 */
function hashPassword(password) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password));
}
