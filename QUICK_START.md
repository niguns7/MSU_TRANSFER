# 🚀 Quick Start Guide - MSU Transfer Advising Form

## Step 1: Start Development Server

```bash
cd "/Users/nirgunsubedi/Desktop/Abroad /MSU_TRANSFER/transfer-advising-form"
yarn dev
```

Then open: **http://localhost:3000**

---

## Step 2: Add Your Images (IMPORTANT!)

Move your MSU images to: `public/images/`

Required files:
- `hero.png` or `hero.jpg` - MSU building background
- `logos.png` - MSU logo (top-left)
- `msu-footer-logo.png` - Footer logo

---

## What You'll See:

### Homepage:
1. **Hero Section** - MSU building with navy overlay
2. **Privacy Note** - Blue-bordered notice
3. **Form Buttons** - Yellow buttons on gradient background
   - "Fill partial Form"
   - "Fill full detail form"

### When You Click "Fill full detail form":
- Beautiful 10-step wizard appears
- Progress bar shows current step
- MSU-branded stepper component
- Form validation on each step
- Professional gradient buttons

---

## MSU Colors Used:

```css
Primary Red:    #840029
Primary Yellow: #FCB116
Orange:         #BA4F21
Primary Gray:   #6E6565
Secondary Gray: #5C5959

Gradient: #840029 → #BA4F21 → #FCB116
```

---

## Troubleshooting:

### If you see "Image not found":
→ Add your images to `public/images/` folder

### If colors look wrong:
→ Clear browser cache and refresh

### If form doesn't show:
→ Check browser console for errors
→ Make sure all dependencies are installed: `yarn install`

---

## File Locations:

- Homepage: `app/page.tsx`
- Theme colors: `app/theme.ts`
- Form wizard: `components/FullFormWizard.tsx`
- Custom styles: `app/globals.css`

---

## Need to Customize?

### Change colors:
Edit: `app/theme.ts` and `tailwind.config.ts`

### Modify form steps:
Edit: `components/FullFormWizard.tsx`

### Update text:
Edit: `app/page.tsx`

---

**That's it! Your MSU-branded form is ready to use! 🎉**
