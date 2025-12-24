import { encode as btoa } from 'base-64';

export const IPIFY_API_URL = 'https://api.ipify.org/?format=json';

// Fetch the public IP address with an optional timeout (ms).
// Returns an empty string on failure to make usage simpler for callers.
export const getIPAddress = async (timeoutMs = 3000): Promise<string> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(IPIFY_API_URL, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) {
            console.error(`Failed to fetch IP address: ${response.status}`);
            return '';
        }
        const data = await response.json();
        return data?.ip ?? '';
    } catch (error) {
        if ((error as any)?.name === 'AbortError') {
            console.error('IP fetch aborted due to timeout');
        } else {
            console.error('Error fetching IP address:', error);
        }
        return '';
    } finally {
        clearTimeout(id);
    }
};

// Validation helpers moved here so screens can reuse the same logic.
export const validateLogin = (payload: { UserName?: string; Password?: string }) => {
    const errors: Record<string, string> = {};
    const emailOrUser = (payload?.UserName || '').trim();
    const password = (payload?.Password || '').toString();

    if (!emailOrUser) {
        errors.UserName = 'Email or username is required';
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUser) === false && emailOrUser.length < 3) {
        // allow short usernames but still require minimal length
        errors.UserName = 'Enter a valid email or username';
    }

    if (!password) {
        errors.Password = 'Password is required';
    } else if (password.length < 6) {
        errors.Password = 'Password must be at least 6 characters';
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

export const validateRegister = (formData: Record<string, any>) => {
    const errors: Record<string, string> = {};
    const email = (formData?.email || '').trim();
    const confirmEmail = (formData?.confirmEmail || '').trim();
    const password = (formData?.password || '').toString();
    const confirm = (formData?.confirmPassword || '').toString();
    const mobile = (formData?.mobileNo || '').toString().replace(/\D/g, '');
    const adhar = (formData?.adharID || '').toString().replace(/\D/g, '');

    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email';
    }

    if (!confirmEmail) {
        errors.confirmEmail = 'Confirm email is required';
    } else if (email !== confirmEmail) {
        errors.confirmEmail = 'Emails do not match';
    }

    if (!mobile) {
        errors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
        errors.mobileNo = 'Enter a valid 10-digit mobile number';
    }

    if (!adhar) {
        errors.adharID = 'Aadhar ID is required';
    } else if (!/^\d{12}$/.test(adhar)) {
        errors.adharID = 'Enter a valid 12-digit Aadhar ID';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!confirm) {
        errors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirm) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

export const defaultLoginPayload = () => ({
    CCode: '',
    UserName: '',
    Password: '',
    AceYear: new Date().toISOString(),
    UserAccessAddress: '',
    UserType: 12,
});


import { DocumentUploadPayload } from "../types/student/studentProfile.types";

export const buildDocumentFormData = (
    payload: DocumentUploadPayload,
    defaultFileName: string,
    defaultMime: string
) => {
    const formData = new FormData();

    const commonFields: Record<string, any> = {
        MeritStudentMasterID: payload.MeritStudentMasterID,
        MeritStudentInfoID: payload.MeritStudentInfoID ?? "",
        ApplicationToken: payload.ApplicationToken,
        AddBy: payload.AddBy,
        AddByTime: payload.AddByTime,
        EditBy: payload.EditBy,
        EditByTime: payload.EditByTime,
    };

    Object.entries(commonFields).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value.toString());
    });

    formData.append("file", {
        uri: payload.file.uri,
        type: payload.file.type || defaultMime,
        name: payload.file.name || defaultFileName,
    } as any);

    return formData;
};

export const extractError = (error: any, fallback: string) => {
    return (
        error?.response?.data?.Message ||
        error?.message ||
        fallback
    );
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
};

/**
 * Generates HTML content with PDF.js to render a PDF from base64 string
 * @param base64Pdf - Base64 encoded PDF string
 * @returns HTML string with embedded PDF.js viewer
 */
export const generatePdfViewerHtml = (base64Pdf: string): string => {
    if (!base64Pdf) return '';

    // Escape base64 string for safe insertion into HTML
    const escapedBase64 = base64Pdf.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>PDF Viewer</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #525252;
      overflow-x: hidden;
      overflow-y: auto;
      width: 100vw;
      min-height: 100vh;
      padding: 10px;
    }
    #pdf-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding-bottom: 20px;
    }
    .page-wrapper {
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      background: white;
    }
    .page-canvas {
      display: block;
      width: 100%;
      height: auto;
      max-width: 100%;
    }
    .loading {
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    }
    .error {
      color: #ff6b6b;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  <div id="pdf-container"></div>
  <script>
    (function() {
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const base64 = '${escapedBase64}';
      const container = document.getElementById('pdf-container');
      
      // Convert base64 to Uint8Array
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Load PDF
      pdfjsLib.getDocument({ data: bytes }).promise
        .then(function(pdf) {
          console.log('PDF loaded, pages:', pdf.numPages);
          
          // Get device pixel ratio for crisp rendering on high-DPI displays
          const dpr = window.devicePixelRatio || 1;
          
          // Calculate scale based on device width (roughly 100% width with some padding)
          const containerWidth = container.offsetWidth || window.innerWidth;
          const baseScale = (containerWidth - 20) / 612; // 612 is standard PDF page width in points
          const scale = Math.min(3.0, baseScale * 1.2); // Increased scale for better quality
          
          // Render all pages
          const renderPromises = [];
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            renderPromises.push(
              pdf.getPage(pageNum).then(function(page) {
                const viewport = page.getViewport({ scale: scale });
                
                // Create canvas for this page
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // Set internal resolution to match device pixel ratio for crisp rendering
                canvas.width = viewport.width * dpr;
                canvas.height = viewport.height * dpr;
                
                // Scale the canvas CSS size to display size
                canvas.style.width = viewport.width + 'px';
                canvas.style.height = viewport.height + 'px';
                
                // Scale the context to match device pixel ratio
                context.scale(dpr, dpr);
                
                canvas.className = 'page-canvas';
                
                // Create wrapper div
                const wrapper = document.createElement('div');
                wrapper.className = 'page-wrapper';
                wrapper.appendChild(canvas);
                container.appendChild(wrapper);
                
                // Render page with the scaled viewport
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                
                return page.render(renderContext).promise;
              })
            );
          }
          
          return Promise.all(renderPromises);
        })
        .then(function() {
          console.log('All PDF pages rendered successfully');
        })
        .catch(function(error) {
          console.error('PDF render error:', error);
          container.innerHTML = '<div class="error">Failed to render PDF: ' + error.message + '</div>';
        });
    })();
  </script>
</body>
</html>
    `;
};

/**
 * PDF Viewer source types
 */
export type PdfSource =
    | { type: 'api'; endpoint: string; method?: 'GET' | 'POST'; payload?: any; headers?: Record<string, string> }
    | { type: 'url'; url: string }
    | { type: 'base64'; base64: string };

/**
 * Opens a PDF viewer screen using navigation
 * Supports API calls (GET/POST), direct URLs, or base64 strings
 * 
 * @param navigation - React Navigation navigation object
 * @param source - PDF source (API endpoint, URL, or base64)
 * @param title - Optional title for the PDF viewer screen (default: 'PDF Viewer')
 * 
 * @example
 * // From API POST call
 * openPdfViewer(navigation, {
 *   type: 'api',
 *   endpoint: '/Admission/AdmissionPaymentGateway/GetbankIAgreeFiles',
 *   method: 'POST',
 *   payload: { MerchentPaymentSettingsID: 123 }
 * }, 'Terms & Conditions');
 * 
 * @example
 * // From direct URL
 * openPdfViewer(navigation, {
 *   type: 'url',
 *   url: 'https://example.com/document.pdf'
 * });
 * 
 * @example
 * // From base64 string (already fetched)
 * openPdfViewer(navigation, {
 *   type: 'base64',
 *   base64: 'JVBERi0xLjQKJeLjz9MKMS...'
 * });
 */
export const openPdfViewer = async (
    navigation: any,
    source: PdfSource,
    title: string = 'PDF Viewer'
): Promise<void> => {
    try {
        if (source.type === 'base64') {
            // Direct base64 - navigate immediately
            navigation.navigate('PdfWebView', {
                pdfBase64: source.base64,
                title: title,
            });
            return;
        }

        if (source.type === 'url') {
            // For URL, we could either:
            // 1. Fetch it and convert to base64, or
            // 2. Use the URL directly in WebView (but PDF.js in WebView needs base64/data URI)
            // For consistency, let's fetch and convert
            const response = await fetch(source.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const base64 = arrayBufferToBase64(arrayBuffer);
            
            navigation.navigate('PdfWebView', {
                pdfBase64: base64,
                title: title,
            });
            return;
        }

        if (source.type === 'api') {
            // API call - need to import api instance dynamically to avoid circular deps
            const { api } = await import('../api/api');
            
            const config: any = {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'application/pdf',
                    ...(source.headers || {}),
                },
            };

            let response;
            if (source.method === 'POST' || (source.method === undefined && source.payload)) {
                response = await api.post(source.endpoint, source.payload || {}, config);
            } else {
                response = await api.get(source.endpoint, config);
            }

            if (!response.data || response.data.byteLength === 0) {
                throw new Error('Empty PDF response from API');
            }

            const base64 = arrayBufferToBase64(response.data);
            
            navigation.navigate('PdfWebView', {
                pdfBase64: base64,
                title: title,
            });
            return;
        }

        throw new Error('Invalid PDF source type');
    } catch (error: any) {
        console.error('Error opening PDF viewer:', error);
        throw error;
    }
};
