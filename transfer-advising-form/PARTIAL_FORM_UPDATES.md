# Partial Form Updates - Study Level & Term Fields

## Overview
Updated the Partial Form with proper select fields and added Country of Birth field. All data now displays in the admin report.

## Changes Made

### 1. Partial Form Modal (`PartialFormModal.tsx`)

#### Study Level Field - Converted to Select
Changed from text input to dropdown with options:
- **Freshman**
- **Undergraduate**
- **Graduate**
- **International Transfer**

```tsx
<select
  className="w-full p-4 mt-2 bg-gray-100 rounded..."
  value={form.values.studyLevel}
  onChange={(e) => form.setFieldValue('studyLevel', e.target.value)}
>
  <option value="">Select Study Level</option>
  <option value="Freshman">Freshman</option>
  <option value="Undergraduate">Undergraduate</option>
  <option value="Graduate">Graduate</option>
  <option value="International Transfer">International Transfer</option>
</select>
```

#### Term Field - Updated Label and Options
Changed label to: **"What is your intended term for transfer?"**

Converted to dropdown with options:
- **Fall**
- **Spring**

**Important:** The field now uses `termSeason` (not `termYear`) to store the season value.

```tsx
<select
  className="w-full p-4 mt-2 bg-gray-100 rounded..."
  value={form.values.termSeason}
  onChange={(e) => form.setFieldValue('termSeason', e.target.value)}
>
  <option value="">Select Term</option>
  <option value="Fall">Fall</option>
  <option value="Spring">Spring</option>
</select>
```

### 2. Database Schema (`schema.prisma`)

#### Added Country of Birth Field
```prisma
// Country of Birth (for partial form)
countryOfBirth  String?
```

#### Updated StudyLevel Enum
```prisma
enum StudyLevel {
  Freshman                // NEW
  Undergraduate
  Graduate
  InternationalTransfer   // NEW - "International Transfer"
  Associate
  Certificate
  Other
}
```

### 3. API Routes

#### POST Route (`/api/submissions/route.ts`)
Added support for partial form fields including `countryOfBirth`:
```typescript
// Partial form fields
...(validated.formMode === 'partial' && {
  dateOfBirth: validated.dateOfBirth,
  address: validated.address,
  studyLevel: validated.studyLevel,
  previousCollege: validated.previousCollege,
  termSeason: validated.termSeason,  // Changed from termYear
  major: validated.major,
  countryOfBirth: validated.countryOfBirth,  // NEW
}),
```

#### PATCH Route (`/api/submissions/[id]/route.ts`)
Added `countryOfBirth` to update handling:
```typescript
if (validated.countryOfBirth !== undefined) updateData.countryOfBirth = validated.countryOfBirth;
```

### 4. Admin Report Page (`/admin/submissions/[id]/page.tsx`)

#### Updated TypeScript Interface
```typescript
interface Submission {
  // ... existing fields
  countryOfBirth: string | null;  // NEW
}
```

#### Added Country of Birth Display
In the Personal Information section:
```tsx
{submission.countryOfBirth && (
  <Grid.Col span={6}>
    <InfoField label="Country of Birth" value={submission.countryOfBirth} />
  </Grid.Col>
)}
```

#### Added Partial Form Specific Section
For partial forms, displays transfer information:
```tsx
{submission.formMode === 'partial' && (
  <Box mb="xl">
    <Title order={3} mb="md">Transfer Information</Title>
    <Grid>
      <Grid.Col span={6}>
        <InfoField label="Study Level" value={submission.studyLevel || 'N/A'} />
      </Grid.Col>
      <Grid.Col span={6}>
        <InfoField label="Previous College" value={submission.previousCollege || 'N/A'} />
      </Grid.Col>
      <Grid.Col span={6}>
        <InfoField label="Intended Term" value={submission.termSeason || 'N/A'} />
      </Grid.Col>
      <Grid.Col span={6}>
        <InfoField label="Major" value={submission.major || 'N/A'} />
      </Grid.Col>
    </Grid>
  </Box>
)}
```

## Database Migration

### Migration Command
```bash
nvm use 22
yarn prisma migrate dev --name add_country_of_birth_and_update_study_levels
```

### What the Migration Does
1. Adds `countryOfBirth` column to `Submission` table
2. Updates `StudyLevel` enum to include:
   - `Freshman`
   - `InternationalTransfer`
3. Maintains backward compatibility with existing data

## Testing Checklist

### Partial Form
- [ ] Study Level dropdown displays all 4 options
- [ ] Study Level selection works correctly
- [ ] Term dropdown displays Fall and Spring options
- [ ] Term selection works correctly (saves to termSeason field)
- [ ] Country of Birth field accepts text input
- [ ] Form submits successfully with all fields
- [ ] Form validation works properly
- [ ] No console errors on submission

### Admin Report
- [ ] Country of Birth displays when present
- [ ] Study Level shows correct value (Freshman, Undergraduate, Graduate, or International Transfer)
- [ ] Intended Term shows correct value (Fall or Spring) in "Transfer Information" section
- [ ] All partial form fields display in separate "Transfer Information" section
- [ ] Personal Information section shows all basic details
- [ ] PDF export includes all partial form data

### Database
- [ ] Migration runs successfully
- [ ] New submissions save correctly
- [ ] Existing submissions still work
- [ ] Study Level enum accepts new values

## Form Field Summary

### Partial Form Fields (All Required)
1. Full Name
2. Email
3. Phone
4. Date of Birth
5. Complete Address
6. **Study Level** (Dropdown: Freshman, Undergraduate, Graduate, International Transfer)
7. Previous College
8. **Intended Term for Transfer** (Dropdown: Fall, Spring)
9. Major
10. Country of Birth

## Notes

- All partial form fields now appear in the admin report
- Study Level and Term are now controlled dropdowns for data consistency
- Country of Birth is optional but recommended for better student tracking
- The term field stores the season (Fall/Spring) not the year
- PDF export includes all partial form data

## Files Modified
1. ✅ `components/PartialFormModal.tsx`
2. ✅ `prisma/schema.prisma`
3. ✅ `app/api/submissions/route.ts`
4. ✅ `app/api/submissions/[id]/route.ts`
5. ✅ `app/admin/submissions/[id]/page.tsx`

---

**Implementation Date:** November 10, 2025  
**Status:** ✅ Complete - Ready for Testing
