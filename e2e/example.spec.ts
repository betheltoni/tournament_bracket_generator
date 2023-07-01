import { test, expect } from '@playwright/test';

test('a user can generate brackets', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Expect a title "to contain" a substring.
    await expect(page.locator('text=Tournament Bracket Generator')).toBeVisible();
    await page.fill('input[data-testid="number_participants"]', '2');
    await page.fill('input[data-testid="participant_0"]', 'team a');
    await page.fill('input[data-testid="participant_1"]', 'team b');

    await page.click('button[type="submit"]');

    


});
