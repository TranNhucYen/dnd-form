import { accountLabels } from '@/features/account/labels';
import { accountDynamicLabels } from '@/features/account/labels.dynamic';
import { accountGeneratedLabels } from '@/features/account/labels.generated';
import { authGeneratedLabels } from '@/features/auth/labels.generated';
import { authDynamicLabels } from '@/features/auth/labels.dynamic';
import { communityGeneratedLabels } from '@/features/community/labels.generated';
import { communityDynamicLabels } from '@/features/community/labels.dynamic';
import { dashboardLabels } from '@/features/dashboard/labels';
import { dashboardGeneratedLabels } from '@/features/dashboard/labels.generated';
import { dashboardDynamicLabels } from '@/features/dashboard/labels.dynamic';
import { editorGeneratedLabels } from '@/features/editor/labels.generated';
import { editorDynamicLabels } from '@/features/editor/labels.dynamic';
import { eformGeneratedLabels } from '@/features/eform/labels.generated';
import { eformDynamicLabels } from '@/features/eform/labels.dynamic';
import { homeLabels } from '@/features/home/labels';
import { homeGeneratedLabels } from '@/features/home/labels.generated';
import { myFormGeneratedLabels } from '@/features/my-form/labels.generated';
import { myFormDynamicLabels } from '@/features/my-form/labels.dynamic';
import { notificationLabels } from '@/features/notifications/labels';
import { notificationsGeneratedLabels } from '@/features/notifications/labels.generated';
import { publicBuilderGeneratedLabels } from '@/features/public-builder/labels.generated';
import { publicBuilderDynamicLabels } from '@/features/public-builder/labels.dynamic';
import { settingsLabels } from '@/features/settings/labels';
import { settingsGeneratedLabels } from '@/features/settings/labels.generated';
import { sharedWithMeLabels } from '@/features/shared-with-me/labels';
import { sharedWithMeGeneratedLabels } from '@/features/shared-with-me/labels.generated';
import { sharedWithMeDynamicLabels } from '@/features/shared-with-me/labels.dynamic';
import { templatesGeneratedLabels } from '@/features/templates/labels.generated';
import { templatesDynamicLabels } from '@/features/templates/labels.dynamic';
import { notificationsDynamicLabels } from '@/features/notifications/labels.dynamic';
import { commonLabels } from './common-labels';

export const supportedLocales = ['vi', 'en'] as const;
export type AppLocale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: AppLocale = 'vi';
export const LOCALE_STORAGE_KEY = 'dragform.locale';

// Mỗi feature tự sở hữu labels; file này chỉ ghép chúng thành resources cho i18next.
export const resources = {
  vi: {
    translation: {
      account: {
        ...accountLabels.vi,
        ...accountDynamicLabels.vi,
        generated: accountGeneratedLabels.vi,
      },
      auth: { ...authDynamicLabels.vi, generated: authGeneratedLabels.vi },
      community: { ...communityDynamicLabels.vi, generated: communityGeneratedLabels.vi },
      common: commonLabels.vi,
      dashboard: { ...dashboardDynamicLabels.vi, generated: dashboardGeneratedLabels.vi },
      editor: { ...editorDynamicLabels.vi, generated: editorGeneratedLabels.vi },
      eform: { ...eformDynamicLabels.vi, generated: eformGeneratedLabels.vi },
      home: { ...homeLabels.vi, generated: homeGeneratedLabels.vi },
      myForm: { ...myFormDynamicLabels.vi, generated: myFormGeneratedLabels.vi },
      nav: dashboardLabels.vi,
      notifications: {
        ...notificationLabels.vi,
        ...notificationsDynamicLabels.vi,
        generated: notificationsGeneratedLabels.vi,
      },
      publicBuilder: {
        ...publicBuilderDynamicLabels.vi,
        generated: publicBuilderGeneratedLabels.vi,
      },
      settings: { ...settingsLabels.vi, generated: settingsGeneratedLabels.vi },
      sharedWithMe: {
        ...sharedWithMeLabels.vi,
        ...sharedWithMeDynamicLabels.vi,
        generated: sharedWithMeGeneratedLabels.vi,
      },
      templates: { ...templatesDynamicLabels.vi, generated: templatesGeneratedLabels.vi },
    },
  },
  en: {
    translation: {
      account: {
        ...accountLabels.en,
        ...accountDynamicLabels.en,
        generated: accountGeneratedLabels.en,
      },
      auth: { ...authDynamicLabels.en, generated: authGeneratedLabels.en },
      community: { ...communityDynamicLabels.en, generated: communityGeneratedLabels.en },
      common: commonLabels.en,
      dashboard: { ...dashboardDynamicLabels.en, generated: dashboardGeneratedLabels.en },
      editor: { ...editorDynamicLabels.en, generated: editorGeneratedLabels.en },
      eform: { ...eformDynamicLabels.en, generated: eformGeneratedLabels.en },
      home: { ...homeLabels.en, generated: homeGeneratedLabels.en },
      myForm: { ...myFormDynamicLabels.en, generated: myFormGeneratedLabels.en },
      nav: dashboardLabels.en,
      notifications: {
        ...notificationLabels.en,
        ...notificationsDynamicLabels.en,
        generated: notificationsGeneratedLabels.en,
      },
      publicBuilder: {
        ...publicBuilderDynamicLabels.en,
        generated: publicBuilderGeneratedLabels.en,
      },
      settings: { ...settingsLabels.en, generated: settingsGeneratedLabels.en },
      sharedWithMe: {
        ...sharedWithMeLabels.en,
        ...sharedWithMeDynamicLabels.en,
        generated: sharedWithMeGeneratedLabels.en,
      },
      templates: { ...templatesDynamicLabels.en, generated: templatesGeneratedLabels.en },
    },
  },
} as const;
