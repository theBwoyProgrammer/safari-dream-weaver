
<div align="center">
  <img width="300" height="300" alt="Ovrt (1)" src="https://github.com/user-attachments/assets/4f48e57d-8e46-4d57-acb0-62c9dd7efc5a" />
</div>





# Tembo Safari Lodge
## Admin and Super Admin User Guide

This guide explains how the Tembo Safari Lodge website administration portal works, how team members receive access, what each role can do, and how to manage lodge content and reservations.

It is written for lodge staff and other non-technical users. No programming knowledge is required for normal daily use.

---

## 1. What the administration portal controls

The administration portal is the private operations area of the website. It is used to manage:

- Lodge rooms shown on the website
- Accommodation packages and their prices
- Package offerings and inclusions
- Gallery images
- Explore activities
- Homepage and page banner images
- Guest reservations
- Payment links
- Guest arrival and departure status
- Team member access

The public website is separate from the administration area. Visitors can see only content marked as active/live. They cannot access the dashboard or change lodge information.

The administration portal is available at:

```text
/admin
```

For example, if the website is hosted at `https://your-lodge-domain.com`, the portal is:

```text
https://tembosafaris.com/admin
```

The login page is:

```text
/admin/login
```

---

## 2. The two administration roles

There are two staff roles:

1. **Admin**
2. **Super Admin**

Both roles sign in through the same Admin Portal. The dashboard changes automatically depending on the role assigned to the signed-in account.

### 2.1 Admin

An Admin is an operational staff member. Admins can access reservations and guest operations, but they cannot change public lodge content or team permissions.

<img width="897" height="648" alt="image" src="https://github.com/user-attachments/assets/6385e583-c0fb-48c7-ad76-96c496917679" />


An Admin can:

- Sign in to the admin portal
- View the dashboard overview
- View reservations
- Create a reservation
- Record guest contact and stay details
- Record the agreed reservation amount
- Create a Pesapal payment link
- Open an existing payment link
- Change a reservation payment status
- Check a guest in
- Check a guest out
- View payment and stay information
- Update permitted reservation operational fields

An Admin cannot:

- Add or edit rooms
- Add or edit accommodation packages
- Change room prices or package offerings
- Add, edit, or delete gallery images
- Add, edit, or delete Explore activities
- Change homepage or banner images
- Add or remove team members
- Promote another person to Super Admin
- Delete reservations

The dashboard identifies this role as:

```text
Admin · read only
```

<img width="1330" height="522" alt="image" src="https://github.com/user-attachments/assets/f7d6ffbe-d0dd-452d-9c62-485611ee00f1" />


This means the Admin is read-only for website content, not that the Admin is unable to manage reservations.

### 2.2 Super Admin

A Super Admin has full administration access. This is the role that should be assigned only to a trusted lodge owner, manager, or designated system administrator.

<img width="1333" height="521" alt="image" src="https://github.com/user-attachments/assets/5c814e57-2548-4893-b06c-668d075f8f20" />


A Super Admin can do everything an Admin can do, plus:

- Manage rooms
- Manage accommodation packages
- Manage package offerings and prices
- Manage gallery images
- Manage Explore activities
- Manage main website images
- Manage team access
- Assign the Admin role
- Assign the Super Admin role
- Remove a team member's active role
- Delete website content

The dashboard identifies this role as:

```text
Super admin
```

Super Admin access should be kept limited. Anyone with this role can change all public information and grant access to other people.

---

## 3. How team accounts are created

Team access has two stages:

1. The person creates a login account.
2. A Super Admin assigns the person's role.

Creating an account alone does **not** give the person access to the dashboard.

### 3.1 New staff member creates an account

The new staff member should:

1. Open the Admin Portal login page.
2. Select **Create a team account**.
3. Enter their full name.
4. Enter their email address.
5. Enter a password.
6. Select **Create account**.

The password must contain at least six characters.

<img width="1090" height="675" alt="image" src="https://github.com/user-attachments/assets/efc7b8b7-255d-4faa-ad74-569caf94ae3c" />


After registration, the account is created with a temporary role:

```text
pending
```

The person will see a message explaining that they must ask the Super Admin to assign their role.

Until the role is assigned, the person cannot enter the dashboard.

### 3.2 Super Admin assigns the role

The Super Admin should:

1. Sign in at `/admin/login`.
2. Open the **Team** section.
3. Enter the new staff member's email address.
4. Optionally enter the person's Firebase Auth UID if the email search does not find the account.
5. Select either:
   - `admin`, or
   - `super_admin`
6. Submit the form.

   <img width="1315" height="503" alt="image" src="https://github.com/user-attachments/assets/22bc5acc-7183-4948-93bc-7096f9c3cd21" />


The normal method is to use the email address. The UID field is an alternative for cases where the email cannot be matched.

After the role is assigned:

1. The new staff member should sign out if they are currently signed in.
2. They should sign in again.
3. The dashboard will now show the sections allowed by their role.

The Team section also lists pending accounts directly. A Super Admin can use the **Set role** dropdown beside a pending account to approve it as either **Admin** or **Super Admin**. This is the recommended approval method because it uses the exact account listed in the dashboard and does not require manually copying a Firebase UID.

### 3.3 Admin password reset

A Super Admin can send a password reset email to an Admin from the **Team** section:

1. Find the Admin account.
2. Select **Reset password**.
3. Ask the Admin to check the email inbox for the reset message.
4. The Admin follows the link in that email and chooses a new password.

Password reset emails are sent to the email address stored on the team profile. If the email does not arrive, check the spam/junk folder and confirm that the address is correct.

Super Admin password resets are intentionally not handled from this dashboard. A Super Admin who forgets their password must contact the technical administrator or system owner for recovery.

### 3.4 Removing a team member's access

To remove active access without deleting the person's login account:

1. Open **Team**.
2. Find the team member.
3. Select the option to remove access.
4. Confirm the action if prompted.

The person's role is changed back to `pending`.

Their Firebase login account still exists, but they can no longer access the administration dashboard until a Super Admin assigns a role again.

### 3.5 Important distinction: account versus role

The login account and the administration role are separate:

- Firebase Authentication stores the login email and password.
- The Firestore user profile stores the person's role.

This is why a person can successfully create an account but still be unable to use the dashboard. They may still be waiting for a Super Admin to assign `admin` or `super_admin`.

---

## 4. Signing in and signing out

### 4.1 Signing in

1. Open `/admin/login`.
2. Enter the registered email.
3. Enter the password.
4. Select **Sign in**.

The system checks:

1. Whether the email and password are correct.
2. Whether a user profile exists.
3. Whether the profile role is `admin` or `super_admin`.

All three checks must pass.

### 4.2 Signing out

Select **Sign out** in the top-right area of the dashboard.

Always sign out when using:

- A shared computer
- A public computer
- A front-desk computer that other people use
- A computer that is being handed to another staff member

### 4.3 Common login messages

#### `INVALID_LOGIN_CREDENTIALS`

The email/password combination was not accepted. Check:

- The email spelling
- The password
- Whether the account was created in the correct website system

If the problem continues, the account may not exist yet or the password may need to be reset by the system administrator.

#### Account is not authorized

This usually means the person registered successfully but still has the `pending` role. Ask a Super Admin to assign `admin` or `super_admin`.

#### No Firestore user profile exists

The login account exists, but its staff profile is missing. A Super Admin or technical administrator must correct the account profile before the person can enter.

---

## 5. Dashboard overview

After signing in, the dashboard opens on **Overview**.

The overview shows counts for:

- Rooms
- Gallery items
- Activities
- Reservations

Selecting a count takes the user to the related section.

The overview also displays a role-specific message:

- Super Admins are reminded that they have full control.
- Admins are reminded that reservations are available while content and team settings are restricted.

The left-hand navigation is role-aware:

### Super Admin navigation

- Overview
- Rooms
- Packages & offerings
- Gallery
- Main images & rates
- Explore activities
- Reservations
- Team

- <img width="1309" height="628" alt="image" src="https://github.com/user-attachments/assets/a430c36d-7a5c-4b4d-b599-36d28d32b298" />


### Admin navigation

- Overview
- Reservations

- <img width="1333" height="647" alt="image" src="https://github.com/user-attachments/assets/86bf116f-ef2c-4cf0-bd06-034bddbed3b2" />


---

## 6. Managing rooms

Rooms and packages are intentionally separate.

### Rooms are room types

A room record describes the actual accommodation type. It does not define the package price breakdown.

Room fields include:

- **Room name**: The public name, such as `Deluxe` or `Standard`.
- **Slug**: A web-friendly identifier. It is usually generated from the room name when creating a new room.
- **Description**: General information about the room.
- **Image URL**: The image displayed for the room when an image is provided.
- **Total rooms**: The number of rooms of that type available at the lodge.
- **Maximum guests**: The maximum number of guests the room is intended to accommodate.
- **Sort order**: Controls the order in which rooms appear.
- **Active/live status**: Determines whether the room can be shown publicly.

### 6.1 Adding a room

A Super Admin should:

1. Open **Rooms**.
2. Complete the room name.
3. Check the generated slug.
4. Add a description.
5. Add an image URL if available.
6. Enter the total number of rooms.
7. Enter the maximum guests.
8. Enter a sort order.
9. Ensure the room is active.
10. Select **Add item**.

    <img width="1312" height="673" alt="image" src="https://github.com/user-attachments/assets/f3a7280f-741b-4881-8dc2-31368f7378aa" />


After saving:

- A success notification appears.
- The form clears.
- The new room appears in the room list.
- The room can appear on the homepage after the public site refreshes.

### 6.2 Editing a room

1. Open **Rooms**.
2. Find the room.
3. Select **Edit**.
4. Change the required fields.
5. Select **Save changes**.

The form is pre-filled with the existing data. Saving updates the same room rather than creating a duplicate.

### 6.3 Deleting a room

1. Open **Rooms**.
2. Select the delete/trash button on the room.
3. Read the confirmation message.
4. Confirm only if the room should be permanently removed.

Deletion is permanent for that room record. If packages are linked to the room, review those packages separately and remove or update them as appropriate.

---

## 7. Managing accommodation packages and offerings

Packages are managed in the separate **Packages & offerings** section.

This is where the lodge defines what a guest receives and what price applies.

### 7.1 Package structure

Each package belongs to one room and contains:

- The related room
- Package name
- Multiple offering items
- One package price
- Sort order
- Active/live status

Examples of package names:

- Full Board
- Half Board
- Bed & Breakfast
- Family Weekend Package
- Honeymoon Package
- Corporate Retreat Package

- <img width="1311" height="670" alt="image" src="https://github.com/user-attachments/assets/6873246b-256f-4e38-8ee4-418e4243435f" />


### 7.2 Adding multiple offerings

A package can have as many offering lines as needed.

For example:

```text
Package: Full Board
Room: Deluxe
Price: 250

Offerings:
- Breakfast
- Lunch
- Dinner
- Private bathroom
- Balcony
- Daily housekeeping
```

To add offerings:

1. Open **Packages & offerings**.
2. Select the related room.
3. Enter the package name.
4. Enter the package price.
5. Enter the first offering.
6. Select **Add offering** for every additional item.
7. Enter one offering per line.
8. Set the sort order.
9. Ensure the package is active.
10. Select **Add item**.

    <img width="1280" height="643" alt="image" src="https://github.com/user-attachments/assets/1f23772d-4062-412f-803e-27460f31b2de" />


The price belongs to the package as a whole. It is not repeated separately for every offering.

### 7.3 Editing a package

1. Open **Packages & offerings**.
2. Find the package.
3. Select **Edit**.
4. Change the room, package name, offerings, price, or order.
5. Select **Save changes**.

The package form clears after a successful save.

### 7.4 Removing an offering from a package

Inside the package editor, select the trash button beside the offering line.

The offering is removed from the package form. Save the package to make the change permanent.

At least one offering should normally remain so visitors can understand what the package includes.

### 7.5 Deleting a package

1. Find the package card.
2. Select the delete button.
3. Confirm the deletion.

The package will no longer appear on the public Accommodation page or in the homepage price breakdown.

### 7.6 How packages appear publicly

The public Accommodation page displays:

- Room name
- Package name
- Package price
- Every offering as a separate bullet item
- A booking/contact button

The homepage displays rooms with their related package price breakdown. The homepage does not use the old hardcoded Full Board, Half Board, or Bed & Breakfast values.

If no active packages are available, the public page shows a message that accommodation packages will be published soon.

---

## 8. Gallery management

Gallery images are managed by Super Admins under **Gallery**.

Each gallery item includes:

- Title
- Category
- Image URL
- Sort order
- Active/live status

### 8.1 Adding an image

1. Open **Gallery**.
2. Enter a title.
3. Enter a category, such as:
   - The Lodge
   - Wildlife
   - Rooms
   - Dining
   - Activities
4. Enter the image URL.
5. Set the sort order.
6. Select **Add item**.

   <img width="1317" height="599" alt="image" src="https://github.com/user-attachments/assets/b1a83553-2fa2-4aac-b331-a7ca6e6a6dd8" />


The image URL must be reachable by the public website.

### 8.2 Editing an image

1. Select **Edit** on the image card.
2. Change the title, category, image URL, or order.
3. Select **Save changes**.

### 8.3 Hiding or deleting an image

Use the active/live setting to hide an image temporarily.

Delete an image only when it is no longer required. A confirmation popup appears before deletion.

---

## 9. Main website images and rates

Super Admins manage site-wide images under **Main images & rates**.

This section is used for named image slots such as:

- `hero`
- `price_schedule`
- `rooms_hero`
- `explore_hero`

The exact label shown to staff explains where the image is used.

### 9.1 What these image slots control

- **Hero**: The main homepage hero image.
- **Price schedule**: The homepage accommodation-side image or schedule artwork.
- **Rooms hero**: The banner image on the Accommodation page.
- **Explore hero**: The banner image on the Explore page.

### 9.2 Adding or updating a site image

1. Open **Main images & rates**.
2. Enter or select the image key.
3. Enter a readable label.
4. Enter the image URL or upload an image where available.
5. Select **Add item** or **Save changes**.

   <img width="1310" height="514" alt="image" src="https://github.com/user-attachments/assets/4f6bffcd-9ad7-4a8f-b372-1781a1fcb377" />


The key determines where the image is used. Do not change an existing key casually, because the public page may be looking for that exact key.

### 9.3 Deleting a site image

Deleting a managed image removes the custom image slot. The public site may then use its built-in fallback image.

Confirm the deletion only after checking which page uses the image.

---

## 10. Explore activities

Explore activities are managed under **Explore activities**.

They appear on the public Explore page.

Each activity can include:

- Title
- Summary
- Details
- Duration
- Price
- Image URL
- Sort order
- Active/live status

Examples:

- Kazinga Channel boat cruise
- Guided game drive
- Nature walk
- Bird watching
- Fishing tour

### 10.1 Adding an activity

1. Open **Explore activities**.
2. Enter the activity title.
3. Add a short summary.
4. Add longer details if needed.
5. Enter the duration.
6. Enter a price if the lodge publishes one.
7. Add an image URL.
8. Set the sort order.
9. Select **Add item**.

    <img width="1308" height="640" alt="image" src="https://github.com/user-attachments/assets/74c17a68-cade-42e1-8ed6-1503f817495e" />


### 10.2 Publishing and hiding activities

Only active activities appear publicly.

Turn an activity off when:

- The activity is unavailable.
- The activity is seasonal.
- The lodge is temporarily unable to arrange it.

Use delete only for activities that should be removed permanently.

---

## 11. Reservations

Reservations are available to both Admins and Super Admins.

The reservation area is intended for bookings recorded by lodge staff after speaking with a visitor or receiving a booking request.

### 11.1 Creating a reservation

1. Open **Reservations**.
2. Select **New reservation**.
3. Enter the guest name.
4. Enter the guest email.
5. Enter the guest phone number if available.
6. Enter the room booked.
7. Select the check-in date.
8. Select the check-out date.
9. Enter the number of rooms.
10. Enter the total agreed amount.
11. Select **Save reservation**.

The form clears after the reservation is submitted.

The system records the reservation as:

```text
status: confirmed
payment_status: unpaid
```

<img width="1309" height="666" alt="image" src="https://github.com/user-attachments/assets/dc792d1a-2d9f-44a4-9693-3bc7cef010d7" />


If the total amount is greater than zero, the system also attempts to create a Pesapal payment link.

### 11.2 Important reservation fields

#### Guest name

Use the guest's real name as provided during the booking conversation.

#### Guest email

This is required and should be checked carefully because it is part of the payment request.

#### Guest phone

Use the complete international number where possible.

#### Room booked

Enter the room or package agreed with the guest. This field is currently entered by staff and should use a clear, consistent name.

#### Check-in and check-out

These dates determine the displayed number of nights.

#### Rooms

Enter the number of rooms reserved, not the number of guests.

#### Total agreed amount

Enter the final amount agreed with the guest. This is the amount used when creating a payment link.

### 11.3 Reservation payment status

Payment status options include:

- `unpaid`
- `payment_link_sent`
- `partially_paid`
- `paid`

Use the payment status to reflect the latest known state.

### 11.4 Creating a payment link

A payment link can be created when the reservation has a total amount greater than zero.

1. Open the reservation.
2. Select **Create payment link**.
3. Wait for the Pesapal link to be created.
4. The payment page opens in a new browser tab.
5. Share the link with the guest through the lodge's normal communication channel.

After a link is created, the button changes to **Open payment link**.

The reservation payment status is updated to:

```text
payment_link_sent
```

<img width="1324" height="494" alt="image" src="https://github.com/user-attachments/assets/88b4dfff-0b88-42b1-b4f6-985421ebdeb0" />


### 11.5 If payment-link creation fails

The reservation should remain saved even when Pesapal cannot create the link.

Check:

- The total amount is greater than zero.
- The guest email is valid.
- The guest has a phone number if required by the payment provider.
- The payment Worker is available.
- The Pesapal configuration is active.

Ask the Super Admin or technical support contact to investigate configuration errors. Do not repeatedly create duplicate reservations just because a payment link failed.

### 11.6 Checking a guest in

A guest can be checked in when:

- The reservation status is `confirmed`.
- The current date is on or after the check-in date.

Select **Check in** on the reservation.

The system records:

- Status: `checked_in`
- Check-in timestamp

The reservation card then displays the remaining nights.

### 11.7 Checking a guest out

When a checked-in guest leaves:

1. Find the reservation.
2. Select **Check out**.

The system records:

- Status: `checked_out`
- Check-out timestamp

The reservation then displays **Stay completed**.

### 11.8 Cancelling a reservation

Only a Super Admin can cancel a reservation from the dashboard.

Use cancellation only after confirming the cancellation with the guest or lodge management.

---

## 12. Pesapal payment flow

The payment system uses the website frontend, a Cloudflare Worker, Firebase authentication, and Pesapal.

Staff do not need to configure these technical services during normal daily operations.

The normal flow is:

1. A staff member creates a reservation.
2. The staff member enters the agreed total amount.
3. The system sends the payment request through the secure payment Worker.
4. Pesapal returns a payment link.
5. The link opens in a new tab.
6. The link is sent to the guest.
7. The guest completes payment on Pesapal.
8. Pesapal returns the guest to the payment result page.
9. The lodge team confirms the reservation and payment status.

The payment result page may show:

- Payment received
- Payment not completed
- Payment processing

If a payment remains pending, contact the lodge administrator and verify the payment in Pesapal before manually marking a reservation as paid.

Do not share or enter Pesapal consumer keys, secrets, Firebase API keys, or Cloudflare secrets in the dashboard.

---

## 13. Public versus private data

### Public visitors can see

- Active rooms
- Active accommodation packages
- Active package offerings and prices
- Active gallery images
- Active Explore activities
- Published site images
- Contact and location information

### Visitors cannot see

- Inactive content
- Admin dashboard
- Team member records
- Reservation records
- Guest contact information
- Internal payment administration
- Pending user roles

### Admins can see

- Reservations and guest information
- Operational reservation status
- Payment status

### Super Admins can additionally see

- Inactive content
- All content management sections
- Team member records
- Full content-management controls

---

## 14. Success messages, errors, and confirmations

The dashboard uses notifications to show the result of an action.

### Success notification

A success notification means the system completed the requested save or update and refreshed the dashboard.

### Error notification

An error notification means the action did not complete. Read the message before trying again.

Common causes include:

- Not being signed in
- Insufficient role permissions
- Missing required fields
- Invalid image URL
- Temporary network problems
- Firestore rules not being deployed
- Payment-provider configuration problems

### Deletion confirmation

The system asks for confirmation before deleting content. This protects against accidental deletion.

Select cancel if unsure.

---

## 15. Recommended daily operating procedure

### At the beginning of a shift

1. Sign in with your own account.
2. Open **Overview**.
3. Check reservations.
4. Review arrivals and departures.
5. Check any payment statuses that need follow-up.

### When receiving a new booking

1. Confirm the guest's name and contact details.
2. Confirm dates and room/package.
3. Confirm the agreed amount.
4. Create the reservation.
5. Create and send the Pesapal payment link if required.
6. Update payment status when payment is confirmed.

### When a guest arrives

1. Find the reservation.
2. Verify the guest details.
3. Select **Check in** when eligible.

### When a guest leaves

1. Find the reservation.
2. Confirm the stay details.
3. Select **Check out**.

### At the end of a shift

1. Ensure payment statuses are current.
2. Ensure arrivals and departures are updated.
3. Sign out on shared devices.

---

## 16. Recommended content-management procedure

### Before publishing a room

Confirm:

- The room name is correct.
- The description is clear.
- The guest capacity is correct.
- The room count is correct.
- The image is appropriate.
- The room is active.

### Before publishing a package

Confirm:

- The correct room is selected.
- The package name is clear.
- Every offering is entered as its own line.
- The price is correct.
- The price is entered as a number.
- The package is active.

### Before publishing an activity

Confirm:

- The title is understandable.
- The summary is concise.
- The details are accurate.
- The duration and price are current.
- The image matches the activity.
- The activity is active.

### Before deleting content

Ask:

- Is the item permanently obsolete?
- Could it be hidden instead?
- Is it currently used in a public page?
- Does another record depend on it?

When in doubt, hide the item rather than deleting it.

---

## 17. Troubleshooting checklist

### A room does not appear on the homepage

Check:

1. The room was saved successfully.
2. The room is active.
3. The public website has been refreshed.
4. The room name and image are valid.

### A package does not appear on the Accommodation page

Check:

1. The package was saved under **Packages & offerings**.
2. The package is linked to the correct room.
3. The package is active.
4. At least one offering was entered.
5. The price is a valid number.
6. Firestore rules have been deployed.

### A package price is blank or incorrect

Check:

1. The package price is filled in.
2. The value is numeric.
3. The package is not an old room-level record.
4. The package is linked to the intended room.

### An activity does not appear on Explore

Check:

1. The activity is active.
2. The title is filled in.
3. The image URL is valid if an image was supplied.
4. The page has been refreshed.

### A gallery image does not appear

Check:

1. The image is active.
2. The image URL opens in a browser.
3. The URL is not restricted to a private account.
4. The item was saved successfully.

### A staff member cannot sign in

Check:

1. They are using the correct email.
2. Their password is correct.
3. They completed account registration.
4. A Super Admin assigned `admin` or `super_admin`.
5. They signed out and signed in again after the role was assigned.

### The dashboard says the account is not authorized

The account probably still has the `pending` role. A Super Admin must assign the correct role in **Team**.

### The dashboard is missing content-management sections

The signed-in account is probably an Admin rather than a Super Admin. Only Super Admins can see Rooms, Packages, Gallery, Main images, Explore activities, and Team.

### A payment link cannot be created

Check:

1. The reservation has a positive total amount.
2. Guest email is valid.
3. The reservation was saved first.
4. The payment status has not already been updated incorrectly.
5. The payment service is available.

If the error mentions authentication, Pesapal, Firebase, Cloudflare, or Worker configuration, contact the technical administrator.

---

## 18. Security and account-safety rules

Every team member should follow these rules:

- Never share a password.
- Never use another person's account.
- Never leave the dashboard signed in on a shared computer.
- Never share payment-provider secrets.
- Never paste Firebase or Cloudflare credentials into guest communications.
- Give Super Admin access only to trusted senior staff.
- Use Admin access for staff who only need reservations.
- Remove access promptly when a staff member leaves.
- Confirm guest payment before treating a reservation as paid.
- Do not delete records to correct a spelling mistake; edit them where possible.

---

## 19. Important technical notes for the system owner

These notes are mainly for the person responsible for deployment and maintenance:

- User login is handled by Firebase Authentication.
- User roles are stored in Firestore user profiles.
- `pending` accounts cannot access the dashboard.
- Public content is controlled by active/live fields.
- Room records are stored separately from `roomPackages`.
- Accommodation packages are stored in the `roomPackages` collection.
- Only Super Admins can write rooms, packages, gallery, activities, site images, and team roles.
- Firebase Firestore rules must be deployed after changes.
- The frontend is hosted on Vercel.
- Pesapal payment processing is handled through the Cloudflare Worker.
- Private payment credentials must not be placed in frontend `VITE_` variables.
- Vercel deployments occur after the repository changes are pushed.

Technical administrators should also maintain backups, rotate exposed payment credentials, and review access periodically.

---

## 20. Quick reference

| Task | Role | Section |
|---|---|---|
| View overview | Admin, Super Admin | Overview |
| View reservations | Admin, Super Admin | Reservations |
| Add reservation | Admin, Super Admin | Reservations |
| Create payment link | Admin, Super Admin | Reservations |
| Check guest in/out | Admin, Super Admin | Reservations |
| Add room | Super Admin | Rooms |
| Edit room | Super Admin | Rooms |
| Add package | Super Admin | Packages & offerings |
| Add multiple offerings | Super Admin | Packages & offerings |
| Change package price | Super Admin | Packages & offerings |
| Manage gallery | Super Admin | Gallery |
| Manage homepage images | Super Admin | Main images & rates |
| Manage Explore activities | Super Admin | Explore activities |
| Add team member role | Super Admin | Team |
| Remove team access | Super Admin | Team |
| Cancel reservation | Super Admin | Reservations |

---

## 21. Final distinction to remember

The most important distinction is:

> **Rooms describe the accommodation. Packages describe what the guest receives and the price.**

Use **Rooms** to manage room types shown on the homepage.

Use **Packages & offerings** to manage Full Board, Half Board, Bed & Breakfast, or any other package and its price/inclusions.

This keeps the public website clear and prevents room information from becoming mixed up with package pricing.






<div align="center">
  Prepared by <a href="https://www.ovrtilabstechsystems.com/">OvrtiLabs Tech Systems</a>
</div>

