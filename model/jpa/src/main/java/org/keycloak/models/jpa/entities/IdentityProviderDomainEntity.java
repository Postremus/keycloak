/*
 * Copyright 2024 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.keycloak.models.jpa.entities;

import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

/**
 * JPA entity representing an internet domain that can be associated with an identity provider.
 *
 * @author <a href="mailto:martin.panzer@active-logistics.com">Martin Panzer</a>
 */
@Entity
@Table(name="IDENTITY_PROVIDER_DOMAIN")
public class IdentityProviderDomainEntity {

    @Id
    @Column(name = "ID", length = 36)
    @Access(AccessType.PROPERTY)
    private String id;

    @Column(name="NAME")
    protected String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDENTITY_PROVIDER_ID")
    private IdentityProviderEntity identityProvider;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IdentityProviderEntity getIdentityProvider() {
        return identityProvider;
    }

    public void setIdentityProvider(IdentityProviderEntity identityProvider) {
        this.identityProvider = identityProvider;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (!(o instanceof IdentityProviderDomainEntity)) return false;

        IdentityProviderDomainEntity that = (IdentityProviderDomainEntity) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        if (name == null) {
            return super.hashCode();
        }
        return name.hashCode();
    }

}
