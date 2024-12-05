import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { FormSubmitButton, SelectControl } from "@keycloak/keycloak-ui-shared";
import {
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { useEffect } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { DefaultSwitchControl } from "../components/SwitchControl";
import { useAlerts } from "@keycloak/keycloak-ui-shared";
import {
  convertAttributeNameToForm,
  convertFormValuesToObject,
  convertToFormValues,
} from "../util";
import { IdentityProviderSelect } from "./IdentityProviderSelect";
import { OrganizationFormType } from "./OrganizationForm";

type LinkIdentityProviderModalProps = {
  orgId: string;
  identityProvider?: IdentityProviderRepresentation;
  onClose: () => void;
};

type LinkRepresentation = {
  alias: string[] | string;
  hideOnLogin: boolean;
  config: {
    "kc.org.domain": string;
  };
};

export const LinkIdentityProviderModal = ({
  orgId,
  identityProvider,
  onClose,
}: LinkIdentityProviderModalProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const form = useForm<LinkRepresentation>({ mode: "onChange" });
  const { control, handleSubmit, formState, setValue } = form;
  const { getValues } = useFormContext<OrganizationFormType>();

  const emailMatchAnyOrgDomain: string = useWatch({
    control,
    name: convertAttributeNameToForm(
      "config.kc.org.broker.redirect.mode.email-matches-any-org-domain",
    ),
    defaultValue:
      identityProvider?.config?.[
        "kc.org.broker.redirect.mode.email-matches-any-org-domain"
      ] ?? "false",
  });

  useEffect(
    () =>
      convertToFormValues(
        {
          ...identityProvider,
          alias: [identityProvider?.alias],
          hideOnLogin: identityProvider?.hideOnLogin,
        },
        setValue,
      ),
    [],
  );

  const submitForm = async (data: LinkRepresentation) => {
    try {
      const foundIdentityProvider = await adminClient.identityProviders.findOne(
        {
          alias: data.alias[0],
        },
      );
      if (!foundIdentityProvider) {
        throw new Error(t("notFound"));
      }
      const { config } = convertFormValuesToObject(data);
      foundIdentityProvider.config = {
        ...foundIdentityProvider.config,
        ...config,
      };
      foundIdentityProvider.hideOnLogin = data.hideOnLogin;
      if (emailMatchAnyOrgDomain === "true") {
        delete foundIdentityProvider.config[
          "kc.org.broker.redirect.mode.email-matches"
        ];
        delete foundIdentityProvider.config["kc.org.domain"];
      }

      await adminClient.identityProviders.update(
        { alias: data.alias[0] },
        foundIdentityProvider,
      );

      if (!identityProvider) {
        await adminClient.organizations.linkIdp({
          orgId,
          alias: data.alias[0],
        });
      }
      addAlert(
        t(!identityProvider ? "linkSuccessful" : "linkUpdatedSuccessful"),
      );
      onClose();
    } catch (error) {
      addError(!identityProvider ? "linkError" : "linkUpdatedError", error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("linkIdentityProvider")}
      isOpen
      onClose={onClose}
      actions={[
        <FormSubmitButton
          formState={formState}
          data-testid="confirm"
          key="confirm"
          form="form"
          allowInvalid
          allowNonDirty
        >
          {t("save")}
        </FormSubmitButton>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <Form id="form" onSubmit={handleSubmit(submitForm)}>
          <IdentityProviderSelect
            name="alias"
            label={t("identityProvider")}
            defaultValue={[]}
            isRequired
            isDisabled={!!identityProvider}
          />
          <DefaultSwitchControl
            name={convertAttributeNameToForm(
              "config.kc.org.broker.redirect.mode.email-matches-any-org-domain",
            )}
            label={t("redirectWhenEmailMatchesAny")}
            labelIcon={t("redirectWhenEmailMatchesAnyHelp")}
            stringify
          />
          {emailMatchAnyOrgDomain === "false" && (
            <>
              <SelectControl
                name={convertAttributeNameToForm("config.kc.org.domain")}
                label={t("domain")}
                controller={{ defaultValue: "" }}
                options={[
                  { key: "", value: t("none") },
                  ...getValues("domains")!.map((d) => ({ key: d, value: d })),
                ]}
                menuAppendTo="parent"
              />
              <DefaultSwitchControl
                name={convertAttributeNameToForm(
                  "config.kc.org.broker.redirect.mode.email-matches",
                )}
                label={t("redirectWhenEmailMatches")}
                labelIcon={t("redirectWhenEmailMatchesHelp")}
                stringify
              />
            </>
          )}
          <DefaultSwitchControl
            name="hideOnLogin"
            label={t("hideOnLoginPage")}
            labelIcon={t("hideOnLoginPageHelp")}
            defaultValue={true}
          />
        </Form>
      </FormProvider>
    </Modal>
  );
};
