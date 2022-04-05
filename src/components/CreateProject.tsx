import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Spacer } from '@geist-ui/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import z from 'zod';

import { gql } from '../utils/gql';
import { Card } from './Card';
import { Icon } from './Icon';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormActions, FormActionRight } from './FormActions';
import { Form } from './Form';
import { Tip } from './Tip';
import { Keyboard } from './Keyboard';
import { useRouter } from '../hooks/router';
import { accentIconColor } from '../design/@generated/themes';

interface CreateProjectProps {
    card?: boolean;
}

export const CreateProject: React.FC<CreateProjectProps> = ({ card }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const t = useTranslations('projects.new');

    const schema = z.object({
        title: z
            .string({
                required_error: t("Project's title is required"),
                invalid_type_error: t("Project's title must be a string"),
            })
            .min(2, {
                message: t("Project's title must be longer than 2 symbols"),
            }),
        description: z.string().optional(),
    });

    type FormType = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitted },
    } = useForm<FormType>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldFocusError: true,
    });

    const createProject = async ({ title, description }: FormType) => {
        const promise = gql.mutation({
            createProject: [
                {
                    user: session!.user,
                    title,
                    description,
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: t('Something went wrong 😿'),
            loading: t('We are creating new project...'),
            success: t('Voila! Project is here 🎉'),
        });

        const res = await promise;

        router.project(String(res.createProject?.id));
    };

    const formContent = (
        <Form onSubmit={handleSubmit(createProject)}>
            <FormInput
                {...register('title')}
                error={isSubmitted ? errors.title : undefined}
                placeholder={t("Project's title")}
                flat="bottom"
            />
            <FormTextarea
                {...register('description')}
                error={isSubmitted ? errors.description : undefined}
                flat="both"
                placeholder={t('And its description')}
            />
            <FormActions flat="top">
                <FormActionRight>
                    <Button
                        size="l"
                        view="primary-outline"
                        type="submit"
                        disabled={!isValid}
                        text={t('Create project')}
                    />
                </FormActionRight>
            </FormActions>
            <Spacer />
        </Form>
    );

    return (
        <>
            {card ? <Card style={{ maxWidth: '800px' }}>{formContent}</Card> : formContent}
            <Tip title={t('Pro tip!')} icon={<Icon type="bulbOn" size="s" color={accentIconColor} />}>
                {t.rich('Press key to create the project', {
                    key: () => <Keyboard command enter />,
                })}
            </Tip>
        </>
    );
};