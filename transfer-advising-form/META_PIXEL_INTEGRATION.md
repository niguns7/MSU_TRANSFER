# Meta Pixel Integration

## Overview
Meta Pixel (ID: 1438918566712036) has been successfully integrated into the Transfer Advising Form application to track page views and lead conversions.

## Changes Made

### 1. Global Pixel Setup (`app/layout.tsx`)
- Added Meta Pixel base code using Next.js `Script` component
- Configured to load with `afterInteractive` strategy for optimal performance
- Tracks PageView events on all pages automatically
- Includes noscript fallback for users with JavaScript disabled

### 2. Lead Tracking on Success Page (`app/success/page.tsx`)
- Added `useEffect` hook to trigger Lead event when success page loads
- Fires after successful form submission and redirect
- Uses client-side tracking via `window.fbq`

### 3. Lead Tracking in Form Component (`components/FullFormWizard.tsx`)
- Added Lead tracking to both submission paths:
  - When updating existing submission (with submissionId)
  - When creating new submission (fallback)
- Fires immediately after successful API response, before redirect

### 4. TypeScript Support (`types/meta-pixel.d.ts`)
- Added type declarations for Meta Pixel's `fbq` function
- Extends Window interface to prevent TypeScript errors
- Supports track, trackCustom, and init methods

## Events Tracked

1. **PageView** - Automatically tracked on every page load
2. **Lead** - Tracked when:
   - Form is successfully submitted (in FullFormWizard)
   - Success page is loaded (double tracking for redundancy)

## Verification Steps

### 1. Install Meta Pixel Helper
- Install the [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

### 2. Test PageView Event
1. Open your application in Chrome
2. Click the Meta Pixel Helper extension icon
3. Verify you see: ✓ PageView event fired
4. Navigate to different pages and confirm PageView fires on each

### 3. Test Lead Event
1. Fill out and submit the transfer advising form
2. Watch the Meta Pixel Helper during submission
3. You should see: ✓ Lead event fired
4. After redirect to /success, you should see another ✓ Lead event fired

### 4. Verify in Meta Events Manager
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel (1438918566712036)
3. Navigate to "Test Events" tab
4. Perform a test submission
5. Verify both PageView and Lead events appear in real-time

## Technical Implementation Details

### Pixel Loading Strategy
- Uses `afterInteractive` to load after page becomes interactive
- Doesn't block initial page render
- Optimal for Core Web Vitals

### Lead Tracking Redundancy
The Lead event is tracked in two places for reliability:
1. **In FullFormWizard** - Fires immediately after successful API response
2. **On Success Page** - Fires when success page loads

This ensures lead tracking even if:
- Redirect happens very quickly
- User refreshes the success page
- Navigation timing varies

### Safety Checks
All tracking calls include:
```typescript
if (typeof window !== 'undefined' && window.fbq) {
  window.fbq('track', 'Lead');
}
```

This prevents errors:
- During server-side rendering
- If pixel script fails to load
- In development/test environments

## Next Steps (Optional)

### 1. Server-Side Tracking (Conversions API)
For more reliable tracking and iOS 14+ compliance:
- Implement Meta Conversions API
- Send Lead events from server after form submission
- Requires API access token from Meta

### 2. Custom Event Parameters
Add additional data to Lead events:
```typescript
window.fbq('track', 'Lead', {
  value: 0,
  currency: 'USD',
  content_name: 'Transfer Form Submission',
  status: form.values.studyLevel
});
```

### 3. Custom Conversions
In Meta Events Manager:
- Create custom conversion for /success URL
- Set up advanced matching
- Configure conversion value

### 4. Advanced Matching
Add user data for better matching (privacy-compliant):
```typescript
fbq('init', '1438918566712036', {
  em: hashedEmail, // SHA-256 hashed
  fn: hashedFirstName,
  ln: hashedLastName
});
```

## Privacy & Compliance

- Meta Pixel collects data according to Meta's Data Policy
- Ensure privacy policy mentions use of Meta Pixel
- Consider adding cookie consent banner for GDPR compliance
- Users can opt-out via browser Do Not Track settings

## Troubleshooting

### Pixel Not Loading
- Check browser console for errors
- Verify internet connection
- Check if ad blockers are interfering
- Use Meta Pixel Helper to diagnose

### Lead Not Tracking
- Verify form submission completes successfully
- Check console for `window.fbq` errors
- Ensure redirect to /success happens
- Test with Meta Pixel Helper active

### Double Tracking
- This is intentional for redundancy
- Can be deduplicated in Meta using event deduplication
- Remove one tracking point if you prefer single tracking

## Files Modified

1. `/app/layout.tsx` - Added global pixel initialization
2. `/app/success/page.tsx` - Added Lead tracking on page load
3. `/components/FullFormWizard.tsx` - Added Lead tracking on submission
4. `/types/meta-pixel.d.ts` - Added TypeScript declarations (new file)

## Support Resources

- [Meta Pixel Setup Guide](https://www.facebook.com/business/help/952192354843755)
- [Meta Pixel Helper](https://www.facebook.com/business/help/1686199411616919)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
